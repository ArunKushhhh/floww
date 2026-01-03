// this function only runs on the server
import "server-only"; // this prevents the server only function to be included in the client side bundle
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { waitFor } from "../helper/waitFor";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";
import { executorRegistry } from "./executor/registry";
import { Environment, ExecutionEnvironment } from "@/types/executor";

export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
    },
    include: {
      workflow: true,
      phases: true,
    },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }

  // todo: setup the execution env
  const environment: Environment = { phases: {} };

  // todo: initialise the execution, this means we update the workflow status to running, started at time to date.now
  await initialiseWorkflowExecution(executionId, execution.workflowId);

  // todo: initialise phases status
  await initialisePhasesStatuses(execution);

  let creditsConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    await waitFor(3000);
    // todo: consume credits
    // todo: execute the phase
    const phaseExecution = await executeWorkflowPhase(phase, environment);
    if (!phaseExecution.success) {
      executionFailed = true;
      break; // this ensures if a phase fails, the next phases are not executed
    }
  }

  // todo: finalise execution
  await finaliseWorkflowExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );

  // todo: lastly, clean up the execution environment eg. closing browser
  revalidatePath("/workflows/runs");
}

async function initialiseWorkflowExecution(
  executionId: string,
  workflowId: string
) {
  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      status: WorkflowExecutionStatus.RUNNING,
      startedAt: new Date(),
    },
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunId: executionId,
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
    },
  });
}

async function initialisePhasesStatuses(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id),
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });
}

async function finaliseWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });

  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId, // this prevents the race condition where the workflow is updated before the execution is finalised
      },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((error) => {
      // do nothing: this would mean we have triggered other phases to update the workflow while an execution was running
    });
}

async function executeWorkflowPhase(
  phase: ExecutionPhase,
  environment: Environment
) {
  const startedAt = new Date();

  const node = JSON.parse(phase.node) as AppNode;
  setupEnvironmentForPhase(node, environment);

  //update the phase status to running
  await prisma.executionPhase.update({
    where: {
      id: phase.id,
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
    },
  });

  // retrieve how many credits are required for this phase
  const creditsRequired = TaskRegistry[node.data.type].credits;

  console.log(
    "Executing phase: ",
    phase.name,
    "with credits required: ",
    creditsRequired
  );

  // todo: decrement the user balance with the credits required

  // simulate a phase execution
  // await waitFor(2000);

  // simulate execution result
  //const success = Math.random() < 0.7; // 70% success rate

  // real execution
  const success = await executePhase(phase, node, environment);

  await finalisePhase(phase.id, success);
  return { success };
}

async function finalisePhase(phaseId: string, success: boolean) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
    },
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment
): Promise<boolean> {
  // for each task type we have defined, we are going to have a function to run
  const runFn = executorRegistry[node.data.type];

  if (!runFn) {
    return false;
  }
  const executionEnvironment: ExecutionEnvironment<any> =
    createExecutionEnvironment(node, environment);
  return await runFn(executionEnvironment); //we are only passing the relevant inputs and outputs to the runFn instead of the entire environment
}

function setupEnvironmentForPhase(node: AppNode, environment: Environment) {
  environment.phases[node.id] = {
    inputs: {},
    outputs: {},
  };

  const inputs = TaskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }

    // if the input is not found, it means it is connected to the output of any other node
    // get input value from outputs in the environment
  }
}

function createExecutionEnvironment(node: AppNode, environment: Environment) {
  return {
    getInput: (name: string) => environment.phases[node.id]?.inputs[name],
    getOutput: (name: string) => environment.phases[node.id].outputs[name],
  };
}
