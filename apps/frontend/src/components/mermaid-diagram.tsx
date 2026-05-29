import { useEffect, useRef, useState } from 'react';

let counter = 0;

export default function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  if (!chart) {
    return null;
  }

  useEffect(() => {
    let cancelled = false;
    const id = `mmd-${++counter}`;

    const render = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          themeVariables: {
            background: 'transparent',
            primaryColor: '#3b3f5c',
            primaryTextColor: '#eef0f7',
            primaryBorderColor: '#5b6cff',
            lineColor: '#8a8fb3',
            fontFamily: 'ui-sans-serif, system-ui',
          },
        });

        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (err) {
        if (!cancelled) setError(String((err as Error)?.message ?? err));
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return <div className="text-sm text-destructive">Diagram error: {error}</div>;
  }
  return <div ref={ref} className="w-full overflow-auto [&_svg]:h-auto [&_svg]:max-w-full" />;
}
