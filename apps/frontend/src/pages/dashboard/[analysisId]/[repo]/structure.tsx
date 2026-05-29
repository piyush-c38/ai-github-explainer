import { useMemo } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageHeader, PageShell } from '@/components/page-header';
import { GraphCanvas, nodeStyle, nodeStylePrimary } from '@/components/graph-canvas';
import { fetcher } from '@/lib/api';
import type { Edge, Node } from 'reactflow';

type RepoFile = {
  path: string;
  name: string;
  type: 'file' | 'folder';
  children?: RepoFile[];
};

const buildTree = (paths: string[]): RepoFile => {
  const root: RepoFile = { path: 'root', name: 'root', type: 'folder', children: [] };
  paths.forEach((fullPath) => {
    const parts = fullPath.split('/').filter(Boolean);
    let current = root;
    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const nextPath = current.path ? `${current.path}/${part}` : part;
      let child = current.children?.find((node) => node.name === part);
      if (!child) {
        child = {
          path: nextPath,
          name: part,
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : [],
        };
        current.children?.push(child);
      }
      current = child;
    });
  });
  return root;
};

function buildGraph(root: RepoFile) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const levels: Record<number, number> = {};

  function walk(node: RepoFile, depth: number, parentId?: string) {
    if (depth > 3) return;
    const index = (levels[depth] = (levels[depth] ?? -1) + 1);
    const id = node.path;
    nodes.push({
      id,
      position: { x: depth * 240, y: index * 80 },
      data: { label: node.name + (node.type === 'folder' ? '/' : '') },
      style: depth === 0 ? nodeStylePrimary : nodeStyle,
    });
    if (parentId) {
      edges.push({ id: `${parentId}->${id}`, source: parentId, target: id });
    }
    node.children?.slice(0, 6).forEach((child) => walk(child, depth + 1, id));
  }

  walk(root, 0);
  return { nodes, edges };
}

export default function StructurePage() {
  const router = useRouter();
  const { analysisId } = router.query;

  const { data, error } = useSWR(analysisId ? `/api/analysis/${analysisId}` : null, fetcher);

  const graph = useMemo(() => {
    if (!data?.files) return { nodes: [], edges: [] };
    const prefix = data.files.reduce((acc: string, current: string) => {
      if (!acc) return current;
      let i = 0;
      while (i < acc.length && i < current.length && acc[i] === current[i]) i += 1;
      return acc.slice(0, i);
    }, '');

    const normalized = data.files.map((pathValue: string) =>
      pathValue.replace(prefix, '').replace(/^\//, '')
    );

    const tree = buildTree(normalized);
    return buildGraph(tree);
  }, [data]);

  if (error) return <DashboardLayout><PageShell>Failed to load analysis.</PageShell></DashboardLayout>;
  if (!data) return <DashboardLayout><PageShell>Loading...</PageShell></DashboardLayout>;
  if (data.status !== 'completed') {
    return <DashboardLayout><PageShell>Analysis in progress: {data.status}</PageShell></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <PageShell>
        <PageHeader
          eyebrow="Visualization"
          title="Folder structure"
          description="Top-level layout of the repository as an interactive graph."
        />
        <GraphCanvas nodes={graph.nodes} edges={graph.edges} height={600} />
      </PageShell>
    </DashboardLayout>
  );
}
