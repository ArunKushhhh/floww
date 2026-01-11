import { timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import {
  ExecutionPhaseStatus,
  workflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { CronExpressionParser } from "cron-parser";

function isValidSecret(secret: string) {
  const API_SECRET = process.env.API_SECRET;

  if (!API_SECRET) {
    return false;
  }

  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
  } catch (error) {
    return false;
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // protecting the endpoint with a secret
  const secret = authHeader.split("Bearer ")[1];

  // checking if the secret is valid
  if (!isValidSecret(secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // read the workflow id from the url
  const { searchParams } = new URL(request.url);
  const workflowId = searchParams.get("workflowId") as string;

  if (!workflowId) {
    return Response.json({ error: "Bad Request" }, { status: 400 });
  }

  // find the workflow by id in the database
  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
    },
  });

  if (!workflow) {
    return Response.json({ error: "Bad Request" }, { status: 400 });
  }

  // parse the execution plan from the workflow
  const executionPlan = JSON.parse(
    workflow.executionPlan!
  ) as workflowExecutionPlan;

  if (!executionPlan) {
    return Response.json({ error: "Bad Request" }, { status: 400 });
  }

  try {
    const cron = CronExpressionParser.parse(workflow.cron!);
    const nextRun = cron.next().toDate();

    // create a new execution in the database
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        userId: workflow.userId,
        status: WorkflowExecutionStatus.PENDING,
        definition: workflow.definition,
        startedAt: new Date(),
        trigger: WorkflowExecutionTrigger.CRON,
        phases: {
          create: executionPlan.flatMap((phase) => {
            return phase.nodes.map((node) => {
              return {
                userId: workflow.userId,
                status: ExecutionPhaseStatus.CREATED,
                number: phase.phase,
                node: JSON.stringify(node),
                name: TaskRegistry[node.data.type].label,
              };
            });
          }),
        },
      },
    });

    // execute the workflow
    await ExecuteWorkflow(execution.id, nextRun);
    return new Response(null, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
