"use client";

import { deleteWorkflow } from "@/actions/workflows/deleteWorkflow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  workflowName: string;
  workflowId: string;
}

export function DeleteWorkflowDialog({
  open,
  setOpen,
  workflowName,
  workflowId,
}: Props) {
  const [confirmText, setConfirmText] = useState("");
  const deleteMutation = useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      toast.success("Workflow deleted successfully", { id: workflowId });
      setConfirmText("");
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete workflow", { id: workflowId });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this workflow, it cannot be recovered again.
          </AlertDialogDescription>
          <div className="flex flex-col gap-4 py-4">
            <p>
              If you are sure, enter <b>"{workflowName}"</b> to confirm:{" "}
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== workflowName || deleteMutation.isPending}
            className={cn(buttonVariants({ variant: "destructive" }))}
            onClick={(e) => {
              e.stopPropagation();
              toast.loading("Deleting workflow...", { id: workflowId });
              deleteMutation.mutate(workflowId);
            }}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
