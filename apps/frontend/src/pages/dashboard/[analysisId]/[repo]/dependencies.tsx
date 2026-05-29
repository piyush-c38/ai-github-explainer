import { useMemo } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReactFlowGraph from '@/components/visualization/ReactFlowGraph';
import { fetcher } from '@/lib/api';
import { createDependencyGraph } from '@/lib/graph-utils';

export default function DependenciesPage() {
  const router = useRouter();
  const { analysisId } = router.query;

  const { data: analysisData, error: analysisError } = useSWR(
    analysisId ? `/api/analysis/${analysisId}` : null,
    fetcher
  );

  const graphData = useMemo(() => {
    if (!analysisData?.dependencies) return { nodes: [], edges: [] };

    const uniqueDeps = new Set<string>();
    Object.values(analysisData.dependencies as Record<string, string[]>).forEach((deps) => {
      deps.forEach((dep) => uniqueDeps.add(dep));
    });

    const dependencyMap: Record<string, string> = {};
    uniqueDeps.forEach((dep) => {
      dependencyMap[dep] = 'import';
    });

    const packageLike = { name: analysisData.repoUrl || 'root' };
    return createDependencyGraph(dependencyMap, packageLike);
  }, [analysisData]);

  if (analysisError) return <DashboardLayout><div>Failed to load analysis.</div></DashboardLayout>;
  if (!analysisData) return <DashboardLayout><div>Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-primary mb-4">Dependency Graph</h1>
      <div className="h-[calc(100vh-10rem)]">
        <ReactFlowGraph nodes={graphData.nodes} edges={graphData.edges} />
      </div>
    </DashboardLayout>
  );
}
