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
} from "reactflow";
import "reactflow/dist/style.css";

interface Props {
  highlight: AnnotatedPdfHighlights;
  returnHome: () => void;
}

const updateHash = (id: string) => {
  document.location.hash = `highlight-${id}`;
};

const nodeTypes = {
  question: QuestionNode,
};

export function Forest({ highlight, returnHome }: Props) {
  console.log(highlight);
  const [nodes, setNodes] = useState(() => {
    return [
      {
        id: highlight!.id,
        position: { x: 0, y: 0 },
        data: {
          comment: highlight?.comments[0]?.text,
          question: highlight?.prompt,
          answer: highlight?.response,
        },
        type: "question",
      },
    ];
  });
  const [edges, setEdges] = useState([]);

  const onNodesChange: OnNodesChange = useCallback(
    // @ts-ignore
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    // @ts-ignore
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

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
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => updateHash(node.id)}
        fitView
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant={"dots" as BackgroundVariant} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
