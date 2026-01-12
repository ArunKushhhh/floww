"use client";

import { deleteCredential } from "@/actions/credentials/deleteCredential";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  name: string;
}

export function DeleteCredentialDialog({ name }: Props) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const deleteMutation = useMutation({
    mutationFn: deleteCredential,
    onSuccess: () => {
      toast.success("Credential deleted successfully", { id: name });
      setConfirmText("");
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete credential", { id: name });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size={"icon"}
          disabled={deleteMutation.isPending}
        >
          <XIcon className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this credential, it cannot be recovered again.
          </AlertDialogDescription>
          <div className="flex flex-col gap-4 py-4">
            <p>
              If you are sure, enter <b>"{name}"</b> to confirm:{" "}
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
            disabled={confirmText !== name || deleteMutation.isPending}
            className={cn(buttonVariants({ variant: "destructive" }))}
            onClick={(e) => {
              e.stopPropagation();
              toast.loading("Deleting credential...", { id: name });
              deleteMutation.mutate(name);
            }}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
