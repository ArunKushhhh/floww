"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";

export async function unpublishWorkflow(workflowId: string) {
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

  if (workflow.status !== WorkflowStatus.PUBLISHED) {
    throw new Error("Workflow is not published");
  }

  await prisma.workflow.update({
    where: {
      id: workflowId,
      userId,
    },
    data: {
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
      creditsCost: 0,
    },
  });
  
  return workflowId;
}
