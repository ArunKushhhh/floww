import { ExecutionPhase } from "@prisma/client";

type Phase = Pick<ExecutionPhase, "creditsConsumed">;

export const GetPhasesTotalCost = (phases: Phase[]) => {
  return phases.reduce((acc: number, phase: Phase) => acc + (phase.creditsConsumed || 0), 0);
};
