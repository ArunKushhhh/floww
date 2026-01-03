"use client";

import { getWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import { getWorkflowPhaseDetails } from "@/actions/workflows/getWorkflowPhaseDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DatesToDurationString } from "@/lib/helper/dates";
import { GetPhasesTotalCost } from "@/lib/helper/phases";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  CircleDashedIcon,
  ClockIcon,
  CoinsIcon,
  Loader2,
  LucideIcon,
  WorkflowIcon,
} from "lucide-react";
import { ReactNode, useState } from "react";

type ExecutionData = Awaited<ReturnType<typeof getWorkflowExecutionWithPhases>>;
function ExecutionViewer({ initialData }: { initialData: ExecutionData }) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    queryFn: () => getWorkflowExecutionWithPhases(initialData!.id),
    // we don't want to load the server with unnecessary requests, so we only refetch when the execution is running
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  });

  const phaseDetails = useQuery({
    queryKey: ["phaseDetails", selectedPhase],
    enabled: selectedPhase !== null,
    queryFn: () => getWorkflowPhaseDetails(selectedPhase!),
  });

  const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;

  const duration = DatesToDurationString(
    query.data?.completedAt,
    query.data?.startedAt
  );

  const creditsConsumed = GetPhasesTotalCost(query.data?.phases || []);
  return (
    <div className="flex w-full h-full">
      <aside className="w-[320px] min-w-[320px] max-w-[320px] border-r-2 border-separate flex flex-col grow overflow-hidden">
        <div className="py-4 px-2">
          {/* status label */}
          <ExecutionLabel
            icon={CircleDashedIcon}
            label="Status"
            value={query.data?.status}
          />
          {/* started at label */}
          <ExecutionLabel
            icon={CalendarIcon}
            label="Started At"
            value={
              query.data?.startedAt
                ? formatDistanceToNow(new Date(query.data.startedAt), {
                    addSuffix: true,
                  })
                : "-"
            }
          />
          <ExecutionLabel
            icon={ClockIcon}
            label="Duration"
            value={
              duration ? duration : <Loader2 className="animate-spin size-4" />
            }
          />
          <ExecutionLabel
            icon={CoinsIcon}
            label="Credits consumed"
            value={creditsConsumed}
          />
        </div>
        <Separator />
        <div className="py-2 px-4 flex justify-center items-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <WorkflowIcon className="size-4 text-muted-foreground/80" />
            <span className="font-medium">Phases</span>
          </div>
        </div>
        <Separator />
        <div className="overflow-auto h-full px-2 py-4">
          {query.data?.phases.map((phase, index) => (
            <Button
              variant={selectedPhase === phase.id ? "secondary" : "ghost"}
              key={phase.id}
              className="w-full justify-between"
              onClick={() => {
                if (isRunning) {
                  return;
                }
                setSelectedPhase(phase.id);
              }}
            >
              <div className="flex items-center gap-2">
                <Badge variant={"outline"}>{index + 1}</Badge>
                <p className="font-medium truncate">{phase.name}</p>
              </div>
              <p className="text-xs text-muted-foreground">{phase.status}</p>
            </Button>
          ))}
        </div>
      </aside>
      <div className="flex w-full h-full">
        <pre>{JSON.stringify(phaseDetails.data, null, 4)}</pre>
      </div>
    </div>
  );
}

export default ExecutionViewer;

function ExecutionLabel({
  icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: ReactNode;
  value: ReactNode;
}) {
  const Icon = icon;
  return (
    <div className="flex justify-between items-center py-2 px-4 text-sm capitalize">
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground/80" />
        <span>{label}</span>
      </div>
      <div className="text-xs font-medium flex gap-2 items-center">{value}</div>
    </div>
  );
}
