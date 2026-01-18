"use client";

import { downloadInvoice } from "@/actions/billing/downloadInvoice";
import { TooltipWrapper } from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Download, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export function InvoiceBtn({ id }: { id: string }) {
  const mutation = useMutation({
    mutationFn: downloadInvoice,
    onSuccess: (data) => (window.location.href = data as string),
    onError: () => toast.error("Something went wrong"),
  });
  return (
    <TooltipWrapper content="Download Invoice">
      <Button
        variant={"ghost"}
        size={"icon"}
        className="text-xs gap-2 text-muted-foreground px-1"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate(id)}
      >
        <Download className="size-4 stroke-primary" />
        {mutation.isPending && <Loader2Icon className="size-4 animate-spin" />}
      </Button>
    </TooltipWrapper>
  );
}
