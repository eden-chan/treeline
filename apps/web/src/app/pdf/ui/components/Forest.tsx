import React, { useCallback, useState } from "react";
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
import type { IHighlight } from "../types";
import "reactflow/dist/style.css";

interface Props {
  highlight: IHighlight;
}

const updateHash = (id: string) => {
  document.location.hash = `highlight-${id}`;
};

export function Forest({ highlight }: Props) {
  console.log(highlight);

  const [nodes, setNodes] = useState(() => {
    return [
      {
        id: highlight!.id,
        position: { x: 0, y: 0 },
        data: { label: highlight?.comment?.text },
        type: "input",
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
    <div style={{ width: "50vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => updateHash(node.id)}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={"dots" as BackgroundVariant} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
