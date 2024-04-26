import { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import { compiler } from 'markdown-to-jsx'
const handleStyle = { left: '50%' };

type NodeData = {
  question: string;
  answer: string;
};

function QuestionNode({ data, isConnectable }: NodeProps<NodeData>) {
  const { question, answer } = data;

  return (
    <div className="border-2 bg-white px-5 py-3">
      <Handle
        type="target"
        position={Position.Top}
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
        type="source"
        position={Position.Bottom}
        id="a"
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
}
export default QuestionNode;
