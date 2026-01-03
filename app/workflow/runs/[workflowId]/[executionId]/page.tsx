import { getWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import ExecutionViewer from "./_components/ExecutionViewer";

export default async function ExecutionPage({
  params,
}: {
  params: Promise<{ workflowId: string; executionId: string }>;
}) {
  const { workflowId, executionId } = await params;
  return (
    <div className="h-screen w-full overflow-hidden flex flex-col">
      <Topbar
        title={`Workflow Run ID: ${executionId}`}
        workflowId={workflowId}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="h-full w-full flex items-center justify-center">
              <Loader2 className="size-10 animate-spin text-primary" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={executionId} />
        </Suspense>
      </section>
    </div>
  );
}

async function ExecutionViewerWrapper({
  executionId,
}: {
  executionId: string;
}) {
  const workflowExecution = await getWorkflowExecutionWithPhases(executionId);
  if (!workflowExecution) {
    return <div>Execution not found</div>;
  }
  return (
    <ExecutionViewer initialData={workflowExecution} />
  );
}
