import React, { useMemo, useState } from "react";
import {
  Highlight,
  CurriculumNode,
} from "@prisma/client";
import QuestionNode from "./flownodes/QuestionNode";
import { Button } from "@/components/ui/button";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";

interface Props {
  highlight: Highlight;
  returnHome: () => void;
}

const updateHash = (id: string) => {
  document.location.hash = `highlight-${id}`;
};

const nodeTypes: NodeTypes = {
  question: QuestionNode,
};

const defaultViewPort = {
  x: 50,
  y: 60,
  zoom: 0.85,
};

const generateNodesAndEdges = (
  highlight: Highlight | CurriculumNode,
): { nodes: Node[]; edges: Edge[] } => {
  const currentNode: Node[] = [
    {
      id: highlight!.id,
      position: { x: 0, y: 0 },
      data: {
        ...(highlight?.prompt
          ? {
              question: highlight?.prompt,
              answer: highlight?.response,
            }
          : {
              label: highlight?.comments[0]?.text,
            }),
      },
      type: highlight.prompt ? "question" : "input",
    },
  ];
  const currentEdges: Edge[] = [];

  if ("nodes" in highlight) {
    for (let child of highlight.nodes) {
      const { nodes, edges } = generateNodesAndEdges(child);
      currentNode.push(...nodes);
      currentEdges.push(...edges);
      currentEdges.push({
        id: `${highlight.id}-${child.id}`,
        source: highlight.id,
        target: child.id,
      });
    }
  }

  return { nodes: currentNode, edges: currentEdges };
};

export function Forest({ highlight, returnHome }: Props) {
  const { nodes, edges } = useMemo(
    () => generateNodesAndEdges(highlight),
    [highlight],
  );

  // const onNodesChange: OnNodesChange = useCallback(
  //   // @ts-ignore
  //   (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
  //   [],
  // );
  //
  // const onEdgesChange: OnEdgesChange = useCallback(
  //   // @ts-ignore
  //   (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
  //   [],
  // );

  return (
    <div style={{ width: "50vw", height: "100vh", position: "relative" }}>
      <Button
        className="absolute top-4 left-4 bg-black z-10"
        onClick={returnHome}
      >
        Go Back
      </Button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        // onNodesChange={onNodesChange}
        // onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => updateHash(node.id)}
        nodeTypes={nodeTypes}
        defaultViewport={defaultViewPort}
      >
        <Controls />
        <MiniMap />
        <Background variant={"dots" as BackgroundVariant} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
