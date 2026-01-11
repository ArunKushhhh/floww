"use server";

import { duplicateWorkflowSchema } from "@/schemas/workflows";
import z from "zod";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";

export async function duplicateWorkflow(
  form: z.infer<typeof duplicateWorkflowSchema>
) {
  const { success, data } = duplicateWorkflowSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const sourceWorkflow = await prisma.workflow.findUnique({
    where: {
      id: data.workflowId,
      userId,
    },
  });

  if (!sourceWorkflow) {
    throw new Error("Workflow not found");
  }

  const result = await prisma.workflow.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      status: WorkflowStatus.DRAFT,
      definition: sourceWorkflow.definition,
    },
  });

  if (!result) {
    throw new Error("Failed to duplicate workflow");
  }

  return result;
}
