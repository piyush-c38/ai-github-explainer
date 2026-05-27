import { useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { fetcher } from '@/lib/api';
import { FolderIcon, DocumentIcon } from '@heroicons/react/24/outline';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

function buildFileTree(files: { path: string }[]): FileNode[] {
  const root: FileNode = { name: 'root', path: '', type: 'directory', children: [] };

  for (const file of files) {
    const parts = file.path.split('/');
    let currentNode = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      let childNode = currentNode.children?.find((child) => child.name === part);

      if (!childNode) {
        childNode = {
          name: part,
          path: parts.slice(0, i + 1).join('/'),
          type: i === parts.length - 1 ? 'file' : 'directory',
          children: i === parts.length - 1 ? undefined : [],
        };
        currentNode.children?.push(childNode);
      }
      currentNode = childNode;
    }
  }
  return root.children || [];
}

function FileTree({ tree, onFileSelect }: { tree: FileNode[]; onFileSelect: (path: string) => void }) {
  return (
    <ul className="space-y-1">
      {tree.map((node) => (
        <li key={node.path}>
          {node.type === 'directory' ? (
            <div>
              <span className="flex items-center p-2 text-on-surface-variant">
                <FolderIcon className="h-5 w-5 mr-2" />
                {node.name}
              </span>
              <div className="pl-4">
                <FileTree tree={node.children || []} onFileSelect={onFileSelect} />
              </div>
            </div>
          ) : (
            <button
              onClick={() => onFileSelect(node.path)}
              className="flex items-center w-full text-left p-2 rounded-md hover:bg-surface-2"
            >
              <DocumentIcon className="h-5 w-5 mr-2" />
              {node.name}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function FilesPage() {
  const router = useRouter();
  const { analysisId } = router.query;
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const { data: analysisData, error: analysisError } = useSWR(
    `/api/analysis/${analysisId}`,
    fetcher
  );

  const { data: fileData, error: fileError } = useSWR(
    selectedFile
      ? `/api/analysis/${analysisId}/file?path=${encodeURIComponent(selectedFile)}`
      : null,
    fetcher
  );

  if (analysisError) return <DashboardLayout><div>Failed to load analysis.</div></DashboardLayout>;
  if (!analysisData) return <DashboardLayout><div>Loading...</div></DashboardLayout>;

  const fileTree = buildFileTree(analysisData.analysis.files);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-primary mb-4">File Explorer</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
        <div className="md:col-span-1 bg-surface-1 p-4 rounded-lg border border-outline overflow-y-auto">
          <FileTree tree={fileTree} onFileSelect={setSelectedFile} />
        </div>
        <div className="md:col-span-2 bg-surface-1 p-4 rounded-lg border border-outline overflow-y-auto">
          {fileError && <div>Failed to load file content.</div>}
          {selectedFile && !fileData && !fileError && <div>Loading file...</div>}
          {fileData && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">{selectedFile}</h2>
              <pre className="text-sm whitespace-pre-wrap">
                <code>{fileData.content}</code>
              </pre>
            </div>
          )}
          {!selectedFile && <div className="text-center text-on-surface-variant">Select a file to view its content.</div>}
        </div>
      </div>
    </DashboardLayout>
  );
}
