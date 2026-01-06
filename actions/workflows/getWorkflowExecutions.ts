"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
export async function getWorkflowExecutions(workflowId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return prisma.workflowExecution.findMany({
    where: {
      workflowId,
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
