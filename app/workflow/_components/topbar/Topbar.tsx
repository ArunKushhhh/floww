"use client";

import { TooltipWrapper } from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { SaveBtn } from "./SaveBtn";
import { ExecuteBtn } from "./ExecuteBtn";

interface Props {
  title: string;
  workflowId: string;
}
function Topbar({ title, workflowId }: Props) {
  const router = useRouter();
  return (
    <header className="flex p-2 border-b-2 border-separate justify-between items-center w-full sticky h-[60px]  top-0 bg-background z-10">
      <div className="flex gap-1 flex-1 items-center">
        <TooltipWrapper content="Back">
          <Button variant={"ghost"} size={"icon"} onClick={() => router.back()}>
            <ChevronLeft />
          </Button>
        </TooltipWrapper>
        <div className="flex gap-1 items-center">
          <p className="font-medium text-ellipsis truncate">{title}</p>
        </div>
      </div>
      <div className="flex gap-1 flex-1 justify-end">
        <ExecuteBtn workflowId={workflowId} />
        <SaveBtn workflowId={workflowId} />
      </div>
    </header>
  );
}

export default Topbar;
