"use server";

import { createWorkflowSchema } from "@/schemas/workflows";
import { auth } from "@clerk/nextjs/server";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { AppNode } from "@/types/appNode";
import { Edge } from "@xyflow/react";
import { CreateFlowNode } from "@/lib/workflow/CreateFlowNode";
import { TaskType } from "@/types/task";

export async function CreateWorkflow(
  form: z.infer<typeof createWorkflowSchema>
) {
  const { success, data } = createWorkflowSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const initialFlow: {
    nodes: AppNode[];
    edges: Edge[];
  } = {
    nodes: [],
    edges: [],
  };

  // workflow entry point
  initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialFlow),
      ...data,
    },
  });

  if (!result) {
    throw new Error("Failed to create workflow");
  }

  return result;
}
