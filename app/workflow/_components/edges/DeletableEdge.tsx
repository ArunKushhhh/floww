"use client";

import { Button } from "@/components/ui/button";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from "@xyflow/react";
import { X } from "lucide-react";

export function DeletableEdge(props: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath(props);
  const { setEdges } = useReactFlow();
  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={props.style}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(${labelX}px, ${labelY}px) translate(-50%, -50%)`,
            pointerEvents: "all",
          }}
        >
          <Button
            variant={"outline"}
            size={"icon"}
            className=" border cursor-pointer rounded-full text-xs leading-none hover:shadow-lg flex items-center justify-center"
            onClick={() => {
              setEdges((eds) => eds.filter((ed) => ed.id !== props.id));
            }}
          >
            <X />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
