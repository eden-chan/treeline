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
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
}

const updateHash = (id: string) => {
  document.location.hash = `highlight-${id}`;
};

export function Forest({ highlights, toggleDocument, resetHighlights }: Props) {
  console.log(highlights);

  const [nodes, setNodes] = useState(() => {
    if (!highlights || highlights?.length === 0) return [];
    return highlights.map((highlight, index) => ({
      id: highlight!.id,
      position: { x: 0, y: index * 100 },
      data: { label: highlight?.comment?.text },
      type: "input",
    }));
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
    <div style={{ width: "50vw", height: "100vh" }} >
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
    </div >
  );
}

// export function Forest({ highlights, toggleDocument, resetHighlights }: Props) {
//   console.log(highlights);
//
//   return (
//     <div className="sidebar" style={{ width: "50vw" }}>
//       <div className="description" style={{ padding: "1rem" }}>
//         <h2 style={{ marginBottom: "1rem" }}>react-pdf-highlighter</h2>
//
//         <p style={{ fontSize: "0.7rem" }}>
//           <a href="https://github.com/agentcooper/react-pdf-highlighter">
//             Open in GitHub
//           </a>
//         </p>
//
//         <p>
//           <small>
//             To create area highlight hold ⌥ Option key (Alt), then click and
//             drag.
//           </small>
//         </p>
//       </div>
//
//       <ul className="sidebar__highlights">
//         {highlights.map((highlight, index) => (
//           <li
//             key={index}
//             className="sidebar__highlight"
//             onClick={() => {
//               updateHash(highlight);
//             }}
//           >
//             <div>
//               <strong>{highlight.comment.text}</strong>
//               {highlight.content.text ? (
//                 <blockquote style={{ marginTop: "0.5rem" }}>
//                   {`${highlight.content.text.slice(0, 90).trim()}…`}
//                 </blockquote>
//               ) : null}
//               {highlight.content.image ? (
//                 <div
//                   className="highlight__image"
//                   style={{ marginTop: "0.5rem" }}
//                 >
//                   <img src={highlight.content.image} alt={"Screenshot"} />
//                 </div>
//               ) : null}
//             </div>
//             <div className="highlight__location">
//               Page {highlight.position.pageNumber}
//             </div>
//           </li>
//         ))}
//       </ul>
//       <div style={{ padding: "1rem" }}>
//         <button onClick={toggleDocument}>Toggle PDF document</button>
//       </div>
//       {highlights.length > 0 ? (
//         <div style={{ padding: "1rem" }}>
//           <button onClick={resetHighlights}>Reset highlights</button>
//         </div>
//       ) : null}
//     </div>
//   );
// }
