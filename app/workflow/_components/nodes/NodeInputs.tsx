"use client";

import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position, useEdges } from "@xyflow/react";
import React from "react";
import { NodeParamField } from "./NodeParamField";
import { ColorForHandle } from "./common";
import { useFlowValidation } from "@/components/hooks/useFlowValidation";

export function NodeInputs({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2 divide-y">{children}</div>;
}
export function NodeInput({
  input,
  nodeId,
}: {
  input: TaskParam;
  nodeId: string;
}) {
  const edges = useEdges();
  const { invalidInputs } = useFlowValidation();
  const isConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name
  );
  const hasErrors = invalidInputs
    .find((node) => node.nodeId === nodeId)
    ?.inputs.find((invalidInput) => invalidInput === input.name);
  return (
    <div
      className={cn(
        "flex justify-start bg-secondary relative p-3",
        hasErrors && "bg-destructive/30"
      )}
    >
      {/* <pre>{JSON.stringify(input, null, 2)}</pre> */}
      <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          isConnectable={!isConnected}
          type="target"
          position={Position.Left}
          className={cn(
            "bg-muted-foreground! border! border-background! -left-2! w-4! h-4!",
            ColorForHandle[input.type]
          )}
        />
      )}
    </div>
  );
}
