import { useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, getNodesBounds, getViewportForBounds, type Edge, type Node } from 'reactflow';
import 'reactflow/dist/style.css';

interface Props {
  nodes: Node[];
  edges: Edge[];
  height?: number;
}

export function GraphCanvas({ nodes, edges, height = 520 }: Props) {
  const defaultViewport = useMemo(() => {
    if (nodes.length === 0) {
      return { x: 0, y: 0, zoom: 1 };
    }

    const bounds = getNodesBounds(nodes);
    const viewport = getViewportForBounds(bounds, 1000, height, 0.15, 0.5, 1.5);

    return {
      ...viewport,
      y: viewport.y,
    };
  }, [height, nodes]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card" style={{ height }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        defaultViewport={defaultViewport}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: 'oklch(0.72 0.16 250)', strokeWidth: 1.5 },
        }}
      >
        <Background gap={20} size={1} color="oklch(0.3 0.025 265)" />
        <MiniMap
          pannable
          zoomable
          maskColor="oklch(0.17 0.018 265 / 0.7)"
          nodeColor={() => 'oklch(0.72 0.16 250)'}
        />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

export const nodeStyle = {
  background: 'oklch(0.24 0.022 265)',
  border: '1px solid oklch(0.32 0.025 265)',
  borderRadius: 12,
  color: 'oklch(0.96 0.005 250)',
  padding: '10px 14px',
  fontSize: 12,
  fontWeight: 500,
};

export const nodeStylePrimary = {
  ...nodeStyle,
  background: 'linear-gradient(135deg, oklch(0.72 0.16 250), oklch(0.7 0.18 320))',
  color: 'oklch(0.15 0.02 265)',
  border: 'none',
};
