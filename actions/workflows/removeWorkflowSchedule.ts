"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function removeWorkflowSchedule(id: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await prisma.workflow.update({
    where: {
      id,
      userId,
    },
    data: {
      cron: null,
      nextRunAt: null,
    },
  });

  revalidatePath("/workflows");
}
