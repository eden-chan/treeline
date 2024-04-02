import { useCallback } from "react";
import { Handle, Position } from "reactflow";

const handleStyle = { left: 10 };

function QuestionNode({ data, isConnectable }) {
  const { question, answer } = data;
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="border-2 bg-white px-5 py-3">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />

      <div>
        <p className="text-black">Question:</p>
        <p className="text-gray-500 ml-2"> {question} </p>
        {answer && (
          <>
            <p className="text-black">Answer:</p>
            <p className="text-gray-500 ml-2"> {answer} </p>
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
