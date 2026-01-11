"use client";

import { CustomDialogHeader } from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { duplicateWorkflowSchema } from "@/schemas/workflows";
import { Copy, Layers2, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Workflow } from "@prisma/client";
import { duplicateWorkflow } from "@/actions/workflows/duplicateWorkflow";

export function DuplicateWorkflowDialog({
  workflowId,
}: {
  workflowId?: string;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof duplicateWorkflowSchema>>({
    resolver: zodResolver(duplicateWorkflowSchema),
    defaultValues: {
      workflowId,
    },
  });
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: duplicateWorkflow,
    onSuccess: (result: Workflow) => {
      // console.log("Resulted workflow: ", result);
      toast.success("Workflow duplicated", { id: "duplicate-workflow" });
      router.push(`/workflow/editor/${result.id}`);
    },
    onError: () => {
      toast.error("Failed to duplicate workflow", { id: "duplicate-workflow" });
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof duplicateWorkflowSchema>) => {
      toast.loading("Duplicating workflow...", { id: "duplicate-workflow" });
      mutate(values);
    },
    [mutate]
  );
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <Copy className="text-muted-foreground size-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          title="Duplicate Workflow"
          icon={Layers2}
          subTitle="Duplicate the current workflow"
        />
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Name
                    <span className="text-muted-foreground text-xs">
                      (required)
                    </span>
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. Login Workflow"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Description
                    <span className="text-muted-foreground text-xs">
                      (optional)
                    </span>
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      placeholder="Give a brief description of what your workflow does."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field?.value?.length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Give a brief description of what your workflow does. <br />{" "}
                    This is optional but can help you remember the workflow's
                    prupose.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <Field orientation="horizontal" className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isPending}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  <p>Creating...</p>
                </div>
              ) : (
                "Create"
              )}
            </Button>
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  );
}
