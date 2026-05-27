import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

interface ReactFlowGraphProps {
  nodes: Node[];
  edges: Edge[];
}

export default function ReactFlowGraph({ nodes, edges }: ReactFlowGraphProps) {
  return (
    <div className="w-full h-full bg-surface-1 rounded-lg border border-outline">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
