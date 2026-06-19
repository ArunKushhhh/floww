"use server";

import { periodToDateRange } from "@/lib/helper/dates";
import { Period } from "@/types/analytics";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { WorkflowExecutionStatus } from "@/types/workflow";

export async function getStatsCardValues(period: Period) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const dateRange = periodToDateRange(period);

  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      createdAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: [WorkflowExecutionStatus.COMPLETED, WorkflowExecutionStatus.FAILED],
      },
    },
    select: {
      creditsConsumed: true,
      phases: {
        where: {
          creditsConsumed: {
            not: null,
          },
        },
        select: {
          creditsConsumed: true,
        },
      },
    },
  });

  const stats = {
    workflowsExecutions: executions.length,
    creditsConsumed: 0,
    phaseExecutions: 0,
  };

  stats.creditsConsumed = executions.reduce(
    (acc: number, execution: (typeof executions)[number]) => acc + execution.creditsConsumed,
    0
  );

  stats.phaseExecutions = executions.reduce(
    (acc: number, execution: (typeof executions)[number]) => acc + execution.phases.length,
    0
  );

  return stats;
}
