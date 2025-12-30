import { getWorkflowsforUser } from "@/actions/workflows/getWorkflowsforUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Workflow } from "lucide-react";
import { Suspense } from "react";
import { CreateWorkflowDialog } from "./_components/CreateWorkflowDialog";
import WorkflowCard from "./_components/WorkflowCard";

export default function Workflows() {
  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <CreateWorkflowDialog />
      </div>

      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  );
}

function UserWorkflowsSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((item) => (
        <Skeleton key={item} className="h-32 w-full" />
      ))}
    </div>
  );
}

async function UserWorkflows() {
  const workflows = await getWorkflowsforUser();
  // console.log("Workflowsfor the user: ", workflows);
  if (!workflows) {
    return (
      <Alert variant={"destructive"}>
        <AlertCircle className="size-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (workflows.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Workflow />
          </EmptyMedia>
          <EmptyTitle>No Workflows Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any workflows yet. Get started by creating
            your first workflow.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CreateWorkflowDialog triggerText="Create your first workflow" />
        </EmptyContent>
      </Empty>
    );
  }
  return <div className="flex flex-col gap-4">
    {workflows.map((workflow) => (
      <WorkflowCard key={workflow.id} workflow={workflow} />
    ))}

  </div>;
}
