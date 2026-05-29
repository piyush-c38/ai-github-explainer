import { useRouter } from 'next/router';
import useSWR from 'swr';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MermaidRenderer from '@/components/visualization/MermaidRenderer';
import { fetcher } from '@/lib/api';
import { createFlowMermaid } from '@/lib/graph-utils';

export default function FlowPage() {
  const router = useRouter();
  const { analysisId } = router.query;

  const { data, error } = useSWR(analysisId ? `/api/analysis/${analysisId}` : null, fetcher);

  if (error) return <DashboardLayout><div>Failed to load analysis.</div></DashboardLayout>;
  if (!data) return <DashboardLayout><div>Loading...</div></DashboardLayout>;
  if (data.status !== 'completed') {
    return <DashboardLayout><div>Analysis in progress: {data.status}</div></DashboardLayout>;
  }
  if (!data.parsedData) {
    return <DashboardLayout><div>Analysis data is incomplete.</div></DashboardLayout>;
  }

  const dataFlowGraph = createFlowMermaid(data.parsedData);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-primary mb-4">Request/Data Flow</h1>
      <div className="h-[calc(100vh-10rem)] bg-surface-1 p-4 rounded-lg border border-outline">
        <MermaidRenderer chart={dataFlowGraph} />
      </div>
    </DashboardLayout>
  );
}
