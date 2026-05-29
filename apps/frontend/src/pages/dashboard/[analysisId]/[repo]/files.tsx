import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageHeader, PageShell } from '@/components/page-header';
import { fetcher } from '@/lib/api';
import { ChevronRight, FileText, Folder, FolderOpen, Star } from 'lucide-react';

type RepoFile = {
  path: string;
  name: string;
  type: 'file' | 'folder';
  important?: boolean;
  children?: RepoFile[];
};

const buildTree = (paths: string[]): RepoFile => {
  const root: RepoFile = { path: '', name: '', type: 'folder', children: [] };
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
          important: /readme|package\.json|tsconfig|tailwind|vite|next\.config|app\//i.test(nextPath),
          children: isFile ? undefined : [],
        };
        current.children?.push(child);
      }
      current = child;
    });
  });
  return root;
};

function Tree({ node, depth = 0, onSelect, selected }: { node: RepoFile; depth?: number; onSelect: (f: RepoFile) => void; selected: string }) {
  const [open, setOpen] = useState(depth < 1);
  const isFolder = node.type === 'folder';
  const active = selected === node.path;

  if (node.path === '') {
    return (
      <div>
        {node.children?.map((child) => (
          <Tree key={child.path} node={child} depth={0} onSelect={onSelect} selected={selected} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => {
          if (isFolder) setOpen((prev) => !prev);
          else onSelect(node);
        }}
        className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm hover:bg-secondary/60 ${active ? 'bg-secondary' : ''}`}
        style={{ paddingLeft: 8 + depth * 14 }}
      >
        {isFolder ? (
          <ChevronRight className={`size-3.5 text-muted-foreground transition-transform ${open ? 'rotate-90' : ''}`} />
        ) : (
          <span className="w-3.5" />
        )}
        {isFolder ? (
          open ? <FolderOpen className="size-4 text-primary" /> : <Folder className="size-4 text-primary" />
        ) : (
          <FileText className="size-4 text-muted-foreground" />
        )}
        <span className="truncate">{node.name}</span>
        {node.important && <Star className="ml-auto size-3 text-accent" />}
      </button>
      {isFolder && open && node.children?.map((child) => (
        <Tree key={child.path} node={child} depth={depth + 1} onSelect={onSelect} selected={selected} />
      ))}
    </div>
  );
}

export default function FilesPage() {
  const router = useRouter();
  const { analysisId } = router.query;
  const [selected, setSelected] = useState<RepoFile | null>(null);

  const { data: analysisData, error: analysisError } = useSWR(
    analysisId ? `/api/analysis/${analysisId}` : null,
    fetcher
  );

  const tree = useMemo(() => {
    if (!analysisData?.files) return null;
    const prefix = analysisData.files.reduce((acc: string, current: string) => {
      if (!acc) return current;
      let i = 0;
      while (i < acc.length && i < current.length && acc[i] === current[i]) i += 1;
      return acc.slice(0, i);
    }, '');

    const normalized = analysisData.files.map((pathValue: string) =>
      pathValue.replace(prefix, '').replace(/^\//, '')
    );

    return buildTree(normalized);
  }, [analysisData]);

  if (analysisError) return <DashboardLayout><PageShell>Failed to load analysis.</PageShell></DashboardLayout>;
  if (!analysisData) return <DashboardLayout><PageShell>Loading...</PageShell></DashboardLayout>;
  if (analysisData.status !== 'completed') {
    return <DashboardLayout><PageShell>Analysis in progress: {analysisData.status}</PageShell></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <PageShell>
        <PageHeader eyebrow="Files" title="File Explorer" description="Browse the repo. Important files are starred." />
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="max-h-[640px] overflow-y-auto rounded-2xl border border-border bg-card p-3">
            {tree ? (
              <Tree node={tree} onSelect={setSelected} selected={selected?.path ?? ''} />
            ) : (
              <div className="text-sm text-muted-foreground">No files found.</div>
            )}
          </div>
          <div className="min-h-[400px] rounded-2xl border border-border bg-card p-6">
            {selected ? (
              <div>
                <div className="text-xs text-muted-foreground">{selected.path}</div>
                <h2 className="mt-1 flex items-center gap-2 text-xl font-semibold">
                  {selected.name}
                  {selected.important && <Star className="size-4 text-accent" />}
                </h2>
                <p className="mt-5 text-sm text-muted-foreground">
                  File summaries will appear here once file-level analysis is enabled.
                </p>
                <pre className="mt-5 overflow-x-auto rounded-xl border border-border bg-secondary/50 p-4 text-xs text-muted-foreground">
{`// Preview placeholder\n// Connect file content API to render previews here.`}
                </pre>
              </div>
            ) : (
              <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
                Select a file to see details.
              </div>
            )}
          </div>
        </div>
      </PageShell>
    </DashboardLayout>
  );
}
