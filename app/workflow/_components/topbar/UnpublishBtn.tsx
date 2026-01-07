"use client";

import { unpublishWorkflow } from "@/actions/workflows/unpublishWorkflow";
import { useExecutionPlan } from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { DownloadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function UnpublishBtn({ workflowId }: { workflowId: string }) {
  const router = useRouter();
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const mutation = useMutation({
    mutationFn: unpublishWorkflow,
    onSuccess: (workflowId) => {
      toast.success("Workflow unpublished.", { id: workflowId });
      router.push(`/workflow/editor/${workflowId}`);
    },
    onError: () => {
      toast.error("Something went wrong.", { id: workflowId });
    },
  });
  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Unpublishing workflow...", { id: workflowId });
        mutation.mutate(workflowId);
      }}
    >
      <DownloadIcon className="size-4 stroke-orange-500" />
      Unpublish
    </Button>
  );
}
