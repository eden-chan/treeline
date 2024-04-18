import React, { useMemo } from "react";
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
import { CurriculumNodeWithRelations } from "@src/lib/types";

interface Props {
  node: CurriculumNodeWithRelations;
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
  node: CurriculumNodeWithRelations,
  x: number = 0,
  y: number = 0,
): { nodes: Node[]; edges: Edge[] } => {
  const currentNode: Node[] = [
    {
      id: node.id,
      position: { x, y },
      data: {
        question: node.prompt,
        answer: node.response,
      },
      type: "question",
    },
  ];

  const currentEdges: Edge[] = [];
  let new_x = x - 500;
  let new_y = y + 500;
  if (node.children) {
    for (let child of node.children) {
      const { nodes, edges } = generateNodesAndEdges(child, new_x, new_y);
      currentNode.push(...nodes);
      currentEdges.push(...edges);
      currentEdges.push({
        id: `${node.id}-${child.id}`,
        source: node.id,
        target: child.id,
      });
      new_x += 500;
    }
  }

  return { nodes: currentNode, edges: currentEdges };
};

export function Forest({ node, returnHome }: Props) {
  const { nodes, edges } = useMemo(() => generateNodesAndEdges(node), [node]);

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
        // onNodeClick={(_, node) => updateHash(node.id)}
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
