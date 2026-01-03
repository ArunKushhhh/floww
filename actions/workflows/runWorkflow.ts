"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import {
  ExecutionPhaseStatus,
  workflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflow";
import { FlowToExecutionPlan } from "@/lib/workflow/ExecutionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";

export async function runWorkflow(form: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { workflowId, flowDefinition } = form;
  if (!workflowId) {
    throw new Error("Workflow ID is required");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found.");
  }

  let executionPlan: workflowExecutionPlan;
  if (!flowDefinition) {
    throw new Error("Flow definition is not defined");
  }

  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);
  if (result.error) {
    throw new Error("Flow definition not valid.");
  }

  if (!result.executionPlan) {
    throw new Error("Execution plan not generated.");
  }

  executionPlan = result.executionPlan;

  // console.log("Execution plan: ", executionPlan);
  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: flowDefinition,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            };
          });
        }),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  });

  if (!execution) {
    throw new Error("Execution not created.");
  }
  ExecuteWorkflow(execution.id); // this process may take time, so we are trigger the function and let it run in the background.

  return execution.id;
}
