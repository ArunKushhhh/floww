"use client";

import { runWorkflow } from "@/actions/workflows/runWorkflow";
import { useExecutionPlan } from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ExecuteBtn({ workflowId }: { workflowId: string }) {
  const router = useRouter();
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const mutation = useMutation({
    mutationFn: runWorkflow,
    onSuccess: (executionId) => {
      toast.success("Workflow execution started.", { id: "flow-execution" });
      router.push(`/workflow/runs/${workflowId}/${executionId}`);
    },
    onError: () => {
      toast.error("Workflow execution failed.", { id: "flow-execution" });
    },
  });
  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        const plan = generate();
        // console.table(plan);

        // client side validation
        if (!plan) {
          toast.error("Workflow execution failed.", { id: "flow-execution" });
          return;
        }
        mutation.mutate({
          workflowId: workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <PlayIcon className="size-4 stroke-orange-400" />
      Execute
    </Button>
  );
}
