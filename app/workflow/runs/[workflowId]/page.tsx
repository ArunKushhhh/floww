import { getWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import Topbar from "../../_components/topbar/Topbar";
import { Suspense } from "react";
import { InboxIcon, Loader2 } from "lucide-react";
import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionsTable } from "./_components/ExecutionsTable";

export default async function ExecutionPage({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = await params;
  return (
    <div className="h-full w-full overflow-auto flex flex-col items-center">
      <Topbar title="All runs" workflowId={workflowId} hideButtons />
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={workflowId} />
      </Suspense>
    </div>
  );
}

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
  //   await waitFor(3000);
  const executions = await getWorkflowExecutions(workflowId);
  if (!executions) {
    return <div>No data</div>;
  }

  if (executions.length === 0) {
    return (
      <div className="container w-full py-6">
        <div className="flex items-center flex-col justify-center h-full w-full gap-2">
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
            <InboxIcon className="size-10 text-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-medium">
              No runs have been triggered yet for this workflow.
            </p>
            <p className="text-sm text-muted-foreground">
              You can trigger a new run in the editor page.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container py-6 w-full">
      <ExecutionsTable workflowId={workflowId} initialData={executions} />
    </div>
  );
}
