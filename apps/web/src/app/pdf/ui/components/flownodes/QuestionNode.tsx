import { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import { motion } from "framer-motion";
import { compiler } from 'markdown-to-jsx'
const handleStyle = { left: '50%' };

type NodeData = {
  question: string;
  answer: string;
};

function chunkString(str: string): string[] {
  const words: string[] = str.split(" ");
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += 2) {
    const chunk = words.slice(i, i + 2);
    if (chunk.length === 2) {
      chunks.push(chunk.join(" ") + " ");
    }
  }

  return chunks;
}


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

            <div>
              {chunkString(answer).map((chunk, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.75 }}
                  className="text-gray-500"
                >
                  {chunk}
                </motion.span>
              ))}
            </div>
            {/* <p className="text-gray-500 ml-2"> {compiler(answer)} </p> */}
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
