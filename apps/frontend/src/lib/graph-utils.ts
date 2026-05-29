import { stratify, tree } from 'd3-hierarchy';
import { Edge, Node } from 'reactflow';

export interface FileTreeNode {
  id: string;
  path: string;
  name: string;
  children?: FileTreeNode[];
}

interface FileTreeItem {
  path: string;
  name: string;
}

export const createFileTreeGraph = (filePaths: string[]) => {
  const items = new Map<string, FileTreeItem>();
  const ensurePath = (pathValue: string) => {
    if (!pathValue) return;
    if (!items.has(pathValue)) {
      items.set(pathValue, {
        path: pathValue,
        name: pathValue.substring(pathValue.lastIndexOf('/') + 1) || pathValue,
      });
    }
    const parent = pathValue.substring(0, pathValue.lastIndexOf('/'));
    if (parent) {
      ensurePath(parent);
    }
  };

  filePaths.forEach((pathValue) => ensurePath(pathValue));

  const hierarchy = stratify<FileTreeItem>()
    .id((d) => d.path)
    .parentId((d) => {
      const parent = d.path.substring(0, d.path.lastIndexOf('/'));
      return parent || null;
    })(Array.from(items.values()));

  const layout = tree<FileTreeItem>().nodeSize([200, 150]);
  const root = layout(hierarchy);

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  root.each((node) => {
    nodes.push({
      id: node.id!,
      position: { x: node.x, y: node.y },
      data: { label: node.data.name, type: node.children ? 'folder' : 'file' },
      type: 'custom',
    });

    if (node.parent) {
      edges.push({
        id: `${node.parent.id}-${node.id}`,
        source: node.parent.id!,
        target: node.id!,
        type: 'smoothstep',
      });
    }
  });

  return { nodes, edges };
};

export const createDependencyGraph = (dependencies: { [key: string]: string }, packageJson: any) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const centerNodeId = packageJson.name || 'root';

    // Add the root package node
    nodes.push({
        id: centerNodeId,
        position: { x: 0, y: 0 },
        data: { label: centerNodeId, type: 'root' },
        type: 'custom',
    });

    const depKeys = Object.keys(dependencies);
    const angleStep = (2 * Math.PI) / depKeys.length;
    const radius = 400;

    depKeys.forEach((dep, i) => {
        const angle = i * angleStep;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        nodes.push({
            id: dep,
            position: { x, y },
            data: { label: `${dep}@${dependencies[dep]}`, type: 'dependency' },
            type: 'custom',
        });

        edges.push({
            id: `${centerNodeId}-${dep}`,
            source: centerNodeId,
            target: dep,
            type: 'smoothstep',
        });
    });

    return { nodes, edges };
};

export const createComponentRelationshipGraph = (parsedData: any[]) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeSet = new Set<string>();

    parsedData.forEach(file => {
        const filePath = file.filePath;
        if (!nodeSet.has(filePath)) {
            nodes.push({
                id: filePath,
                position: { x: Math.random() * 800, y: Math.random() * 600 },
                data: { label: filePath.substring(filePath.lastIndexOf('/') + 1), type: 'file' },
                type: 'custom',
            });
            nodeSet.add(filePath);
        }

        file.dependencies.forEach((dep: string) => {
            // For now, only link internal dependencies
            const depPath = parsedData.find(f => f.filePath.includes(dep))?.filePath;
            if (depPath) {
                if (!nodeSet.has(depPath)) {
                    nodes.push({
                        id: depPath,
                        position: { x: Math.random() * 800, y: Math.random() * 600 },
                        data: { label: depPath.substring(depPath.lastIndexOf('/') + 1), type: 'file' },
                        type: 'custom',
                    });
                    nodeSet.add(depPath);
                }
                edges.push({
                    id: `${filePath}-${depPath}`,
                    source: filePath,
                    target: depPath,
                    type: 'smoothstep',
                });
            }
        });
    });

    return { nodes, edges };
};

const sanitizeMermaidId = (value: string) => value.replace(/[^a-zA-Z0-9_]/g, '_');

export const createArchitectureMermaid = (repoUrl: string, files: string[]) => {
  const topLevelCounts = new Map<string, number>();
  files.forEach((filePath) => {
    const normalized = filePath.replace(/^[A-Za-z]:/g, '');
    const parts = normalized.split('/').filter(Boolean);
    const top = parts.length > 0 ? parts[0] : 'root';
    topLevelCounts.set(top, (topLevelCounts.get(top) || 0) + 1);
  });

  const repoLabel = repoUrl || 'repository';
  const repoId = sanitizeMermaidId(repoLabel);
  const lines = [`graph TD`, `${repoId}["${repoLabel}"]`];

  Array.from(topLevelCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .forEach(([folder, count]) => {
      const nodeId = sanitizeMermaidId(folder);
      lines.push(`${nodeId}["${folder} (${count})"]`);
      lines.push(`${repoId} --> ${nodeId}`);
    });

  return lines.join('\n');
};

export const createFlowMermaid = (parsedData: any[]) => {
  const edges = new Set<string>();
  const nodes = new Set<string>();

  parsedData.forEach((file) => {
    if (!file?.filePath || !Array.isArray(file.dependencies)) return;
    const from = sanitizeMermaidId(file.filePath);
    nodes.add(from);
    file.dependencies.slice(0, 10).forEach((dep: string) => {
      const to = sanitizeMermaidId(dep);
      nodes.add(to);
      edges.add(`${from} --> ${to}`);
    });
  });

  const lines = ['graph LR'];
  Array.from(nodes).slice(0, 50).forEach((nodeId) => {
    lines.push(`${nodeId}["${nodeId}"]`);
  });

  Array.from(edges).slice(0, 80).forEach((edge) => {
    lines.push(edge);
  });

  return lines.join('\n');
};
