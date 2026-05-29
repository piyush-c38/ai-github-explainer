import { useMemo } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageHeader, PageShell } from '@/components/page-header';
import { GraphCanvas, nodeStyle, nodeStylePrimary } from '@/components/graph-canvas';
import { fetcher } from '@/lib/api';
import type { Edge, Node } from 'reactflow';

export default function DependenciesPage() {
  const router = useRouter();
  const { analysisId } = router.query;

  const { data: analysisData, error: analysisError } = useSWR(
    analysisId ? `/api/analysis/${analysisId}` : null,
    fetcher
  );

  const { nodes, edges, list } = useMemo(() => {
    if (!analysisData?.dependencies) {
      return { nodes: [] as Node[], edges: [] as Edge[], list: [] as string[] };
    }

    const uniqueDeps = new Set<string>();
    Object.values(analysisData.dependencies as Record<string, string[]>).forEach((deps) => {
      deps.forEach((dep) => uniqueDeps.add(dep));
    });

    const deps = Array.from(uniqueDeps);
    const centerId = 'root';
    const centerNode: Node = {
      id: centerId,
      position: { x: 0, y: 0 },
      data: { label: 'Dependencies' },
      style: nodeStylePrimary,
    };

    const radius = 260;
    const depNodes = deps.map((dep, index) => {
      const angle = (index / Math.max(deps.length, 1)) * Math.PI * 2;
      return {
        id: dep,
        position: { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius },
        data: { label: dep },
        style: nodeStyle,
      } as Node;
    });

    const depEdges = deps.map((dep) => ({
      id: `${centerId}-${dep}`,
      source: centerId,
      target: dep,
    })) as Edge[];

    return { nodes: [centerNode, ...depNodes], edges: depEdges, list: deps };
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
          description="Dependencies inferred from import statements."
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
