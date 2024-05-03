"use client";
import Dagre, { Label } from "@dagrejs/dagre";
import React, { useEffect } from "react";
import QuestionNode from "./flownodes/QuestionNode";
import { Button } from "@/components/ui/button";
import ReactFlow, {
	useReactFlow,
	useNodesState,
	useEdgesState,
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
import { useAskHighlight } from "@src/context/ask-highlight-context";

interface Props {
	node: CurriculumNodeWithRelations;
	returnHome: () => void;
}

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeTypes: NodeTypes = {
	question: QuestionNode,
};

const defaultViewPort = {
	x: 50,
	y: 60,
	zoom: 0.85,
};

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
	g.setGraph({ rankdir: "LR" });

	edges.forEach((edge) => g.setEdge(edge.source, edge.target));
	nodes.forEach((node) => g.setNode(node.id, node as Label));

	Dagre.layout(g);

	return {
		nodes: nodes.map((node) => {
			const { x, y } = g.node(node.id);

			return { ...node, position: { x, y } };
		}),
		edges,
	};
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
			type: x == 0 && y == 0 ? "input" : "question",
			data: {
				question: node.prompt,
				answer: node.response,
			},
			draggable: true,
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
const styles = {
	width: "100%",
	height: "100%",
};

export function Forest({ node, returnHome }: Props) {
	const { fitView } = useReactFlow();
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const { generateFollowUpResponse } = useAskHighlight();

	useEffect(() => {
		const { nodes, edges } = generateNodesAndEdges(node);
		const layouted = getLayoutedElements(nodes, edges);

		setNodes([...layouted.nodes]);
		setEdges([...layouted.edges]);

		window.requestAnimationFrame(() => {
			fitView();
		});
	}, [node]);

	return (
		<div className="w-full h-screen relative">
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
				onNodeClick={(_, node) => generateFollowUpResponse(node.id)}
				nodeTypes={nodeTypes}
				defaultViewport={defaultViewPort}
				style={styles}
			>
				<Controls />
				<MiniMap />
				<Background variant={"dots" as BackgroundVariant} gap={12} size={1} />
			</ReactFlow>
		</div>
	);
}
