"use client";

import { Workflow } from "@prisma/client";
import { ReactFlowProvider } from "@xyflow/react";
import { FlowEditor } from "./FlowEditor";
import Topbar from "./topbar/Topbar";
import TaskMenu from "./TaskMenu";

export function WorkflowEditor({ workflow }: { workflow: Workflow }) {
  return (
    <ReactFlowProvider>
      <div className="h-full w-full flex overflow-hidden flex-col">
        <Topbar title={workflow.name} workflowId={workflow.id} />
        <section className="flex h-full overflow-auto">
          <TaskMenu />
          <FlowEditor workflow={workflow} />
        </section>
      </div>
    </ReactFlowProvider>
  );
}
