"use client";

import { TooltipWrapper } from "@/components/TooltipWrapper";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { WorkflowStatus } from "@/types/workflow";
import { Workflow } from "@prisma/client";
import {
  ArrowUpRightIcon,
  FileText,
  MoreVerticalIcon,
  Play,
  ShuffleIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DeleteWorkflowDialog } from "./DeleteWorkflowDialog";

const statusColors = {
  [WorkflowStatus.DRAFT]: "bg-yellow-400 text-yellow-700",
  [WorkflowStatus.PUBLISHED]: "bg-primary",
};

const WorkflowCard = ({ workflow }: { workflow: Workflow }) => {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center justify-end gap-2">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full",
              statusColors[workflow.status as WorkflowStatus]
            )}
          >
            {isDraft ? (
              <FileText className="size-5" />
            ) : (
              <Play className="size-5" />
            )}
          </div>
          <div>
            <h3 className="flex items-center">
              <Link
                href={`/workflow/editor/${workflow.id}`}
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "flex items-center text-muted-foreground"
                )}
              >
                {workflow.name}
                <ArrowUpRightIcon className="size-4" />
              </Link>
              {isDraft && (
                <Badge className="bg-yellow-200 text-yellow-700">Draft</Badge>
              )}
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "flex items-center"
            )}
          >
            <ShuffleIcon className="size-4" />
            <p>Edit</p>
          </Link>
          <WorkflowActions workflowName={workflow.name} workflowId={workflow.id} />
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowCard;

function WorkflowActions({
  workflowName,
  workflowId,
}: {
  workflowName: string;
  workflowId: string;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <DeleteWorkflowDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        workflowName={workflowName}
        workflowId={workflowId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"secondary"} size={"sm"} className="px-2">
            <TooltipWrapper content="More actions">
              <div className="w-full h-full flex justify-center items-center">
                <MoreVerticalIcon size={18} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive flex items-center gap-2"
            onSelect={() => setShowDeleteDialog((prev) => !prev)}
          >
            <Trash2Icon className="size-4 text-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
