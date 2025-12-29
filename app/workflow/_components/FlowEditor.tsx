"use client";

import { CreateFlowNode } from "@/lib/workflow/CreateFlowNode";
import { TaskType } from "@/types/task";
import { Workflow } from "@prisma/client";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { NodeComponent } from "./nodes/NodeComponent";
import { useCallback, useEffect } from "react";
import { AppNode } from "@/types/appNode";
import { DeletableEdge } from "./edges/DeletableEdge";

const nodeTypes = {
  FlowwNode: NodeComponent,
};

const edgeTypes = {
  default: DeletableEdge,
};

const snapGrid: [number, number] = [20, 20];

const fitViewOptions = {
  padding: 1,
};

export function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) {
        return;
      }
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);

      if (!flow.viewport) {
        return;
      }
    } catch (error) {
      console.error("Failed to parse workflow definition", error);
    }
  }, [workflow.definition, setNodes, setEdges, setViewport]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const taskType = event.dataTransfer.getData("application/reactflow");
    if (!taskType || typeof taskType === "undefined") {
      return;
    }
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    const newNode = CreateFlowNode(taskType as TaskType, position);
    setNodes((nds) => nds.concat(newNode));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
  }, []);

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitView
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
      </ReactFlow>
    </main>
  );
}
