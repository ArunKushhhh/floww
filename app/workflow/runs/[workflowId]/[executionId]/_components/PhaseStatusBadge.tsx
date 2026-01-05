import { ExecutionPhaseStatus } from "@/types/workflow";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleXIcon,
  Loader2,
} from "lucide-react";

export function PhaseStatusBadge({ status }: { status: ExecutionPhaseStatus }) {
  switch (status) {
    case ExecutionPhaseStatus.PENDING:
      return <CircleDashedIcon className="text-muted-foreground" />;
    case ExecutionPhaseStatus.RUNNING:
      return <Loader2 className="animate-spin stroke-yellow-300" />;
    case ExecutionPhaseStatus.FAILED:
      return <CircleXIcon className="stroke-destructive" />;
    case ExecutionPhaseStatus.COMPLETED:
      return <CircleCheckIcon className="stroke-green-400" />;
    default:
      return <div className="rounded-full">{status}</div>;
  }
}
