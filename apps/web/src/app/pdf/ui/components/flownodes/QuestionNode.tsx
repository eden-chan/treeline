import { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import { compiler } from "markdown-to-jsx";

type NodeData = {
	question: string;
	answer: string;
};

function QuestionNode({ data, isConnectable }: NodeProps<NodeData>) {
	const { question, answer } = data;

	return (
		<div className="border-2 bg-white px-5 py-3 max-w-[800px] hover:cursor-pointer hover:shadow-xl transition">
			<Handle
				id="b"
				type="target"
				position={Position.Left}
				isConnectable={isConnectable}
			/>

			<div>
				<p className="text-black">Question:</p>
				<p className="text-gray-500 ml-2"> {compiler(question)} </p>
				{answer && (
					<>
						<p className="text-black">Answer:</p>
						<p className="text-gray-500 ml-2"> {compiler(answer)} </p>
					</>
				)}
			</div>
			<Handle
				id="a"
				type="source"
				position={Position.Right}
				isConnectable={isConnectable}
			/>
		</div>
	);
}
export default QuestionNode;
