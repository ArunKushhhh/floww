"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { FlowToExecutionPlan } from "@/lib/workflow/ExecutionPlan";
import { calculateWorkflowCost } from "@/lib/workflow/helpers";

export async function publishWorkflow({
  workflowId,
  flowDefinition,
}: {
  workflowId: string;
  flowDefinition: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Workflow is not a draft");
  }

  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);
  if (result.error) {
    throw new Error("Flow definition not valid");
  }

  if (!result.executionPlan) {
    throw new Error("No execution plan generated");
  }

  const creditsCost = calculateWorkflowCost(flow.nodes);

  await prisma.workflow.update({
    where: {
      id: workflowId,
      userId,
    },
    data: {
      definition: flowDefinition,
      executionPlan: JSON.stringify(result.executionPlan),
      creditsCost,
      status: WorkflowStatus.PUBLISHED,
    },
  });

  return workflowId;
}
