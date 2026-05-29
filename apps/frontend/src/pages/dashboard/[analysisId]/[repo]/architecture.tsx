import { useRouter } from 'next/router';
import useSWR from 'swr';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MermaidRenderer from '@/components/visualization/MermaidRenderer';
import { fetcher } from '@/lib/api';
import { createArchitectureMermaid } from '@/lib/graph-utils';

export default function ArchitecturePage() {
  const router = useRouter();
  const { analysisId } = router.query;

  const { data, error } = useSWR(analysisId ? `/api/analysis/${analysisId}` : null, fetcher);

  if (error) return <DashboardLayout><div>Failed to load analysis.</div></DashboardLayout>;
  if (!data) return <DashboardLayout><div>Loading...</div></DashboardLayout>;
  if (data.status !== 'completed') {
    return <DashboardLayout><div>Analysis in progress: {data.status}</div></DashboardLayout>;
  }
  if (!data.repoUrl || !data.files) {
    return <DashboardLayout><div>Analysis data is incomplete.</div></DashboardLayout>;
  }

  const architectureGraph = createArchitectureMermaid(data.repoUrl, data.files);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-primary mb-4">Architecture Overview</h1>
      <div className="h-[calc(100vh-10rem)] bg-surface-1 p-4 rounded-lg border border-outline">
        <MermaidRenderer chart={architectureGraph} />
      </div>
    </DashboardLayout>
  );
}
