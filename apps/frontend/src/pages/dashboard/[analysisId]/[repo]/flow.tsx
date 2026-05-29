import { useRouter } from 'next/router';
import useSWR from 'swr';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MermaidDiagram from '@/components/mermaid-diagram';
import { PageHeader, PageShell } from '@/components/page-header';
import { fetcher } from '@/lib/api';
import { createFlowMermaid } from '@/lib/graph-utils';

export default function FlowPage() {
  const router = useRouter();
  const { analysisId } = router.query;

  const { data, error } = useSWR(analysisId ? `/api/analysis/${analysisId}` : null, fetcher);

  if (error) return <DashboardLayout><PageShell>Failed to load analysis.</PageShell></DashboardLayout>;
  if (!data) return <DashboardLayout><PageShell>Loading...</PageShell></DashboardLayout>;
  if (data.status !== 'completed') {
    return <DashboardLayout><PageShell>Analysis in progress: {data.status}</PageShell></DashboardLayout>;
  }
  if (!data.parsedData) {
    return <DashboardLayout><PageShell>Analysis data is incomplete.</PageShell></DashboardLayout>;
  }

  const dataFlowGraph = createFlowMermaid(data.parsedData);

  return (
    <DashboardLayout>
      <PageShell>
        <PageHeader
          eyebrow="Visualization"
          title="Request and data flow"
          description="How files depend on each other across the repo."
        />
        <div className="rounded-2xl border border-border bg-card p-6">
          <MermaidDiagram chart={dataFlowGraph} />
        </div>
      </PageShell>
    </DashboardLayout>
  );
}
