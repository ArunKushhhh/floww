"use client";

import { CreateFlowNode } from "@/lib/workflow/CreateFlowNode";
import { TaskType } from "@/types/task";
import { Workflow } from "@prisma/client";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { NodeComponent } from "./nodes/NodeComponent";
import { useEffect } from "react";

const nodeTypes = {
  FlowwNode: NodeComponent,
};

const snapGrid: [number, number] = [20, 20];

const fitViewOptions = {
  padding: 1,
};

export function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { setViewport } = useReactFlow();

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
      // this wont work as we have fitView enabled
      // const { x = 0, y = 0, zoom = 0.8 } = flow.viewport;
      // setViewport({ x, y, zoom });
    } catch (error) {
      console.error("Failed to parse workflow definition", error);
    }
  }, [workflow.definition, setNodes, setEdges, setViewport]);
  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitView
        fitViewOptions={fitViewOptions}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
      </ReactFlow>
    </main>
  );
}
