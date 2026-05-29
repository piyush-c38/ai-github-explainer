import { useMemo } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { fetcher } from '@/lib/api';
import ReactFlowGraph from '@/components/visualization/ReactFlowGraph';
import { createFileTreeGraph } from '@/lib/graph-utils';

export default function FilesPage() {
  const router = useRouter();
  const { analysisId } = router.query;

  const { data: analysisData, error: analysisError } = useSWR(
    analysisId ? `/api/analysis/${analysisId}` : null,
    fetcher
  );

  const graphData = useMemo(() => {
    if (!analysisData?.files) return { nodes: [], edges: [] };
    return createFileTreeGraph(analysisData.files);
  }, [analysisData]);

  if (analysisError) return <DashboardLayout><div>Failed to load analysis.</div></DashboardLayout>;
  if (!analysisData) return <DashboardLayout><div>Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-primary mb-4">File Structure</h1>
      <div className="h-[calc(100vh-10rem)]">
        <ReactFlowGraph nodes={graphData.nodes} edges={graphData.edges} />
      </div>
    </DashboardLayout>
  );
}
