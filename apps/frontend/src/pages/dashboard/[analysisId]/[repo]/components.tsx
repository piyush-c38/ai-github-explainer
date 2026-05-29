import { useMemo } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageHeader, PageShell } from '@/components/page-header';
import { GraphCanvas, nodeStyle, nodeStylePrimary } from '@/components/graph-canvas';
import { fetcher } from '@/lib/api';
import type { Edge, Node } from 'reactflow';

export default function ComponentsPage() {
  const router = useRouter();
  const { analysisId } = router.query;

  const { data: analysisData, error: analysisError } = useSWR(
    analysisId ? `/api/analysis/${analysisId}` : null,
    fetcher
  );

  const { nodes, edges } = useMemo(() => {
    if (!analysisData?.parsedData) return { nodes: [] as Node[], edges: [] as Edge[] };

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeSet = new Set<string>();

    analysisData.parsedData.forEach((file: { filePath: string; dependencies: string[] }, index: number) => {
      if (!file?.filePath) return;
      if (!nodeSet.has(file.filePath)) {
        nodes.push({
          id: file.filePath,
          position: { x: Math.random() * 800, y: Math.random() * 600 },
          data: { label: file.filePath.substring(file.filePath.lastIndexOf('/') + 1) },
          style: index === 0 ? nodeStylePrimary : nodeStyle,
        });
        nodeSet.add(file.filePath);
      }

      file.dependencies?.slice(0, 5).forEach((dep) => {
        const depNode = analysisData.parsedData.find((f: { filePath: string }) => f.filePath.includes(dep));
        if (depNode) {
          if (!nodeSet.has(depNode.filePath)) {
            nodes.push({
              id: depNode.filePath,
              position: { x: Math.random() * 800, y: Math.random() * 600 },
              data: { label: depNode.filePath.substring(depNode.filePath.lastIndexOf('/') + 1) },
              style: nodeStyle,
            });
            nodeSet.add(depNode.filePath);
          }
          edges.push({
            id: `${file.filePath}-${depNode.filePath}`,
            source: file.filePath,
            target: depNode.filePath,
          });
        }
      });
    });

    return { nodes, edges };
  }, [analysisData]);

  if (analysisError) return <DashboardLayout><PageShell>Failed to load analysis.</PageShell></DashboardLayout>;
  if (!analysisData) return <DashboardLayout><PageShell>Loading...</PageShell></DashboardLayout>;
  if (analysisData.status !== 'completed') {
    return <DashboardLayout><PageShell>Analysis in progress: {analysisData.status}</PageShell></DashboardLayout>;
  }
  if (!analysisData.parsedData || analysisData.parsedData.length === 0) {
    return <DashboardLayout><PageShell>No component relationships detected.</PageShell></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <PageShell>
        <PageHeader
          eyebrow="Visualization"
          title="Component relationships"
          description="Inferred import relationships between files."
        />
        <GraphCanvas nodes={nodes} edges={edges} height={560} />
      </PageShell>
    </DashboardLayout>
  );
}
