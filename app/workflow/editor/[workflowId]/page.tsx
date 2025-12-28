import React from "react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { waitFor } from "@/lib/helper/waitFor";
import { WorkflowEditor } from "../../_components/WorkflowEditor";

export async function EditorPage({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = await params;
  const { userId } = await auth();
  if (!userId) {
    return <div>Unauthorized</div>;
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });
  if (!workflow) {
    return <div>Workflow not found</div>;
  }
  return <WorkflowEditor workflow={workflow} />;
}

export default EditorPage;
