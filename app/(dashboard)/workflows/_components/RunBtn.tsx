"use client";

import { runWorkflow } from "@/actions/workflows/runWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Play } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function RunBtn({ workflowId }: { workflowId: string }) {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: runWorkflow,
    onSuccess: (executionId) => {
      toast.success("Workflow started.", { id: workflowId });
      router.push(`/workflow/runs/${workflowId}/${executionId}`);
    },
    onError: () => {
      toast.error("Something went wrong.", { id: workflowId });
    },
  });
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Scheduling run...", { id: workflowId });
        mutation.mutate({ workflowId });
      }}
    >
      <Play className="size-4" />
      Run
    </Button>
  );
}
