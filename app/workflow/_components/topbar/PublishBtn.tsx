"use client";

import { publishWorkflow } from "@/actions/workflows/publishWorkflow";
import { useExecutionPlan } from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function PublishBtn({ workflowId }: { workflowId: string }) {
  const router = useRouter();
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const mutation = useMutation({
    mutationFn: publishWorkflow,
    onSuccess: (workflowId) => {
      toast.success("Workflow published.", { id: workflowId });
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
        const plan = generate();
        // client side validation
        if (!plan) {
          toast.error("Workflow execution failed.", { id: "flow-execution" });
          return;
        }
        toast.loading("Publishing workflow...", { id: workflowId });
        mutation.mutate({
          workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <UploadIcon className="size-4 stroke-green-400" />
      Publish
    </Button>
  );
}
