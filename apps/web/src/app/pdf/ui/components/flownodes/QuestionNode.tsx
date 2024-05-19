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
				<div className="text-gray-500 ml-2"> {compiler(question)} </div>
				{answer && (
					<>
						<p className="text-black">Answer:</p>
						<div className="text-gray-500 ml-2"> {compiler(answer)} </div>
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
