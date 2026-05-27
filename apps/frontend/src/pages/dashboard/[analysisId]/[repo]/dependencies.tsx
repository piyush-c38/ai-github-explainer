import DashboardLayout from '@/components/layout/DashboardLayout';
import ReactFlowGraph from '@/components/visualization/ReactFlowGraph';
import { Node, Edge } from 'reactflow';

// Mock data
const nodes: Node[] = [
  { id: '1', position: { x: 250, y: 5 }, data: { label: 'package.json' } },
  { id: '2', position: { x: 100, y: 100 }, data: { label: 'index.js' } },
  { id: '3', position: { x: 400, y: 100 }, data: { label: 'utils.js' } },
];
const edges: Edge[] = [
  { id: 'e2-1', source: '2', target: '1' },
  { id: 'e2-3', source: '2', target: '3' },
];

export default function DependenciesPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-primary mb-4">Dependency Graph</h1>
      <div className="h-[calc(100vh-10rem)]">
        <ReactFlowGraph nodes={nodes} edges={edges} />
      </div>
    </DashboardLayout>
  );
}
