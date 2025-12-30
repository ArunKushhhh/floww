import { AppNode } from "@/types/appNode";
import {
  workflowExecutionPlan,
  WorkflowExecutionPlanPhase,
} from "@/types/workflow";
import { Edge, getIncomers } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";
import { error } from "console";

type FlowToExecutionPlanType = {
  executionPlan?: workflowExecutionPlan;
};

export function FlowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[]
): FlowToExecutionPlanType {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );
  if (!entryPoint) {
    throw new Error("No entry point found");
  }

  //   the for loop should be stopped either if the maximum number of iterations have been made or if all the nodes have been executed
  const planned = new Set<string>(); //this contains all the nodes that have been added to the execution plan

  const executionPlan: workflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];

  // add the entry point to the planned set
  planned.add(entryPoint.id);

  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = {
      phase,
      nodes: [],
    };

    // now visit the nodes that haven't been added to the execution plan
    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) {
        // node already present in the execution plan
        continue;
      }

      //   validation of inputs
      const invalidInputs = getInvalidInputs(currentNode, edges, planned);
      if (invalidInputs.length > 0) {
        const incomers = getIncomers(currentNode, nodes, edges);
        // check if every incomer has been planned
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          // if all incomers are planned and there are still invalid inputs, this means  that this particular node has an invlaid input, therefore the workflow is invalid
          console.error(
            "Invalid inputs found: ",
            currentNode.id,
            invalidInputs
          );
          throw new Error("TODO: Handle error");
        } else {
          // if all incomers are not planned, then continue
          continue;
        }
      }

      //   if the flow reaches here, it means either the node is reading input entered manually by the user or has received the value from a node that has been planned
      //   thus it can be added to the execution plan
      nextPhase.nodes.push(currentNode);
    }
    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }
    executionPlan.push(nextPhase);
  }

  return { executionPlan };
}

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
  const invalidInputs = [];

  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    const inputValueProvided = inputValue?.length > 0;
    if (inputValueProvided) {
      // this means that the input is fine and we can continue
      continue;
    }

    // if the value is not provided by the user, we need to check if it can be received from a node that has been planned
    const incomingEdges = edges.filter((edge) => edge.target === node.id);

    const inputLinkedToOutput = incomingEdges.find(
      (edge) => edge.targetHandle === input.name
    );

    const requiredInputProvidedByVisitedOutput =
      input.required &&
      inputLinkedToOutput &&
      planned.has(inputLinkedToOutput.source);

    if (requiredInputProvidedByVisitedOutput) {
      // if this is true, it means that the input is required and it has a valid input provided by a node that has been planned
      continue;
    } else if (!input.required) {
      if (!inputLinkedToOutput) {
        // if the input is not required but there is an output linked to it, then we need to be sure if the output has been planned
        continue;
      }
      if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source)) {
        // this means that the output is providing a value to the input: the input is valid
        continue;
      }
    }
    invalidInputs.push(input.name);
  }

  return invalidInputs;
}
