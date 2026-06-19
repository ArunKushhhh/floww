"use server";

import { periodToDateRange } from "@/lib/helper/dates";
import { Period } from "@/types/analytics";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { eachDayOfInterval, format } from "date-fns";
import { ExecutionPhaseStatus } from "@/types/workflow";

type Stats = Record<string, { success: number; failed: number }>;

export async function getCreditsUsageInPeriod(period: Period) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const dateRange = periodToDateRange(period);
  const executionPhases = await prisma.executionPhase.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: [ExecutionPhaseStatus.COMPLETED, ExecutionPhaseStatus.FAILED],
      },
    },
  });

  const dateFormat = "yyyy-MM-dd";

  const stats: Stats = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  })
    .map((date) => format(date, dateFormat))
    .reduce((acc: Stats, date: string) => {
      acc[date] = {
        success: 0,
        failed: 0,
      };
      return acc;
    }, {} as Stats);

  executionPhases.forEach((phase: (typeof executionPhases)[number]) => {
    const date = format(phase.startedAt!, dateFormat);
    if (phase.status === ExecutionPhaseStatus.COMPLETED) {
      stats[date].success += phase.creditsConsumed || 0;
    }
    if (phase.status === ExecutionPhaseStatus.FAILED) {
      stats[date].failed += phase.creditsConsumed || 0;
    }
  });

  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos,
  }));

  return result;
}
