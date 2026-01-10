"use client";

import { updateWorkflowCron } from "@/actions/workflows/updateWorkflowCron";
import { CustomDialogHeader } from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon, ClockIcon, Router, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import cronstrue from "cronstrue";
import { CronExpressionParser } from "cron-parser";
import { removeWorkflowSchedule } from "@/actions/workflows/removeWorkflowSchedule";
import { Separator } from "@/components/ui/separator";

export function SchedulerDialog(props: {
  workflowId: string;
  cron: string | null;
}) {
  const [cron, setCron] = useState(props.cron);
  const [validCron, setValidCron] = useState(false);
  const [readableCron, setReadableCron] = useState("");

  const mutation = useMutation({
    mutationFn: updateWorkflowCron,
    onSuccess: () => {
      toast.success("Schedule updated successfully", { id: "cron" });
    },
    onError: () => {
      toast.error("Something went wrong", { id: "cron" });
    },
  });

  const removeSchedulerMutation = useMutation({
    mutationFn: removeWorkflowSchedule,
    onSuccess: () => {
      toast.success("Schedule removed successfully", { id: "cron" });
    },
    onError: () => {
      toast.error("Something went wrong", { id: "cron" });
    },
  });

  useEffect(() => {
    try {
      CronExpressionParser.parse(cron || "");
      const humanCronString = cronstrue.toString(cron || "");
      setValidCron(true);
      setReadableCron(humanCronString);
    } catch (error: any) {
      setValidCron(false);
    }
  }, [cron]);

  const workflowHasValidCron = props.cron && props.cron.length > 0;

  const readableSavedCron = workflowHasValidCron
    ? cronstrue.toString(props.cron!)
    : "";
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          size={"sm"}
          className={cn(
            "text-sm h-auto p-0 text-orange-500",
            workflowHasValidCron && "text-primary"
          )}
        >
          {workflowHasValidCron && (
            <div className="flex items-center gap-1">
              <ClockIcon />
              {readableSavedCron}
            </div>
          )}
          {!workflowHasValidCron && (
            <div className="flex items-center gap-1">
              <TriangleAlert />
              Set Schedule
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          title="Schedule Workflow Execution"
          subTitle="Schedule workflow execution at regular intervals."
          icon={CalendarIcon}
        />
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Specify a cron expression to schedule periodic workflow execution.
            All times are in UTC.
          </p>
          <Input
            placeholder="e.g. * * * * *"
            value={cron || ""}
            onChange={(e) => setCron(e.target.value)}
          />
          <div
            className={cn(
              "bg-accent rounded-md border border-destructive text-destructive text-sm p-4",
              validCron && "border-primary text-primary"
            )}
          >
            {validCron ? readableCron : "Not a valid cron expression."}
          </div>

          {workflowHasValidCron && (
            <DialogClose asChild>
              <Button
                variant={"outline"}
                className="w-full text-destructive border border-destructive hover:text-destructive"
                disabled={
                  removeSchedulerMutation.isPending || mutation.isPending
                }
                onClick={() => {
                  toast.loading("Removing schedule...", { id: "cron" });
                  removeSchedulerMutation.mutate(props.workflowId);
                }}
              >
                Remove current schedule
              </Button>
            </DialogClose>
          )}
        </div>
        <DialogFooter className="flex-col-reverse!">
          <DialogClose asChild>
            <Button className="w-full" variant={"secondary"}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={mutation.isPending || !validCron}
              className="w-full"
              onClick={() => {
                toast.loading("Saving...", { id: "cron" });
                mutation.mutate({
                  id: props.workflowId,
                  cron: cron || "",
                });
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
