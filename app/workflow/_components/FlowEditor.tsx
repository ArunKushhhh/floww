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
  getOutgoers,
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
import { TaskRegistry } from "@/lib/workflow/task/registry";

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
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

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

  const onDrop = useCallback(
    (event: React.DragEvent) => {
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
    },
    [screenToFlowPosition, setNodes]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
      if (!connection.targetHandle) {
        return;
      }

      // remove the input value if it is present on connection
      const node = nodes.find((n) => n.id === connection.target);
      if (!node) {
        return;
      }

      const nodeInputs = node.data.inputs;
      delete nodeInputs[connection.targetHandle];
      updateNodeData(node.id, { inputs: nodeInputs });
      // console.log("updated node: ", node.id);
    },
    [setEdges, updateNodeData, nodes]
  );

  // console.log("nodes: ", nodes);

  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      // no self connection allowed
      if (connection.source === connection.target) {
        return false;
      }

      // same taskparamtype connection
      // allow connection of outputs and inputs only if they have the same type
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);
      if (!sourceNode || !targetNode) {
        console.error("Invalid connection: Source or target node not found.");
        return false;
      }
      const sourceTasks = TaskRegistry[sourceNode.data.type];
      const targetTasks = TaskRegistry[targetNode.data.type];
      const output = sourceTasks.outputs.find(
        (o) => o.name === connection.sourceHandle
      );
      const input = targetTasks.inputs.find(
        (i) => i.name === connection.targetHandle
      );
      // console.log("Debug: ", { input, output });

      if (input?.type !== output?.type) {
        console.error("Invalid connection: Input and output type mismatch");
        return false;
      }

      // detect cycle
      const hasCycle = (node: AppNode, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      // check if the connection creates a cycle, if it does, do not allow the connection
      const detectedCycle = hasCycle(targetNode);
      return !detectedCycle;
    },
    [nodes, edges]
  );

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
        isValidConnection={isValidConnection}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
      </ReactFlow>
    </main>
  );
}
