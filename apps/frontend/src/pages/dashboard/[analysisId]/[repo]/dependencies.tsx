import { useMemo } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageHeader, PageShell } from '@/components/page-header';
import { GraphCanvas, nodeStyle, nodeStylePrimary } from '@/components/graph-canvas';
import { fetcher } from '@/lib/api';
import { createDependencyGraph, getDeclaredPackageDependencies } from '@/lib/graph-utils';
import type { Edge, Node } from 'reactflow';

export default function DependenciesPage() {
  const router = useRouter();
  const { analysisId } = router.query;

  const { data: analysisData, error: analysisError } = useSWR(
    analysisId ? `/api/analysis/${analysisId}` : null,
    fetcher
  );

  const { nodes, edges, list } = useMemo(() => {
    const declaredDependencies = getDeclaredPackageDependencies(
      analysisData?.packageJson,
      analysisData?.dependencies as Record<string, string>
    );

    if (Object.keys(declaredDependencies).length === 0) {
      return { nodes: [] as Node[], edges: [] as Edge[], list: [] as string[] };
    }

    const { nodes: graphNodes, edges: graphEdges } = createDependencyGraph(
      declaredDependencies,
      analysisData.packageJson
    );

    const deps = Object.keys(declaredDependencies);
    const nodes = graphNodes.map((node, index) => ({
      ...node,
      style: index === 0 ? nodeStylePrimary : nodeStyle,
    }));

    return { nodes, edges: graphEdges, list: deps };
  }, [analysisData]);

  if (analysisError) return <DashboardLayout><PageShell>Failed to load analysis.</PageShell></DashboardLayout>;
  if (!analysisData) return <DashboardLayout><PageShell>Loading...</PageShell></DashboardLayout>;
  if (analysisData.status !== 'completed') {
    return <DashboardLayout><PageShell>Analysis in progress: {analysisData.status}</PageShell></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <PageShell>
        <PageHeader
          eyebrow="Visualization"
          title="Dependency graph"
          description="Dependencies declared in the analyzed repo's package.json."
        />
        <GraphCanvas nodes={nodes} edges={edges} height={600} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              No dependencies detected.
            </div>
          ) : (
            list.map((dep) => (
              <div key={dep} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                <div>
                  <div className="text-sm font-medium">{dep}</div>
                  <div className="text-xs text-muted-foreground">import</div>
                </div>
                <span className="rounded-full bg-secondary px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  dependency
                </span>
              </div>
            ))
          )}
        </div>
      </PageShell>
    </DashboardLayout>
  );
}
