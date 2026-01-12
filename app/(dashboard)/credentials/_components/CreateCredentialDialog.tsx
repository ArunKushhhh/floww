"use client";

import { CustomDialogHeader } from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createWorkflowSchema } from "@/schemas/workflows";
import { Layers2, Loader2, ShieldEllipsis } from "lucide-react";
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
import { CreateWorkflow } from "@/actions/workflows/createWorkflow";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { createCredentialSchema } from "@/schemas/credential";
import { createCredential } from "@/actions/credentials/createCredential";

export function CreateCredentialDialog({
  triggerText,
}: {
  triggerText?: string;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof createCredentialSchema>>({
    resolver: zodResolver(createCredentialSchema),
    defaultValues: {
      name: "",
      value: "",
    },
  });
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: createCredential,
    onSuccess: () => {
      toast.success("Credential created", { id: "create-credential" });
    },
    onError: () => {
      toast.error("Failed to create credential", { id: "create-credential" });
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof createCredentialSchema>) => {
      toast.loading("Creating workflow...", { id: "create-workflow" });
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
        <Button>{triggerText ?? "Create"}</Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          icon={ShieldEllipsis}
          title="Create Credential"
          subTitle="Create a new credential"
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
                    <span className="text-primary text-xs">(required)</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. API Key"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <FieldDescription>
                    Enter a unique and description name for your credential.
                    <br /> This name will be used to identify the credential.
                  </FieldDescription>
                </Field>
              )}
            />
            <Controller
              name="value"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Value
                    <span className="text-primary text-xs">(required)</span>
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      placeholder="Give a brief description of what your credential does."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                  </InputGroup>
                  <FieldDescription>
                    Enter the value associated with this credential. <br /> This
                    value will be securely encrypted and stored.
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
