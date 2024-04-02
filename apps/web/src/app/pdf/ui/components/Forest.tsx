import React, { useCallback, useState } from "react";
import { AnnotatedPdfHighlights } from "@prisma/client";
import QuestionNode from "./flownodes/QuestionNode";
import { Button } from "@/components/ui/button";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";

interface Props {
  highlight: AnnotatedPdfHighlights;
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

export function Forest({ highlight, returnHome }: Props) {
  const nodes = [
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
  const [edges, setEdges] = useState([]);

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
