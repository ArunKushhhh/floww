"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { CronExpressionParser } from "cron-parser";
import { revalidatePath } from "next/cache";

export async function updateWorkflowCron({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const interval = CronExpressionParser.parse(cron);
    await prisma.workflow.update({
      where: {
        id,
        userId,
      },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    });
  } catch (error: any) {
    console.error("Invalid cron expression: ", error.message);
    throw new Error("Invalid cron expression");
  }

  revalidatePath("/workflows");
}
