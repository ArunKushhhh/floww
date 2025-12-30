"use client";

import { useExecutionPlan } from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";

export function ExecuteBtn({ workflowId }: { workflowId: string }) {
  const generate = useExecutionPlan();
  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const plan = generate();
        console.table(plan);
      }}
    >
      <PlayIcon className="size-4 stroke-orange-400" />
      Execute
    </Button>
  );
}
