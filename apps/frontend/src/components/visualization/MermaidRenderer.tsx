import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function MermaidRenderer({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chart && ref.current) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        themeVariables: {
          primaryColor: '#8AB4F8',
          mainBkg: '#1E1F20',
          textColor: '#E3E3E3',
        },
      });
      mermaid.render('mermaid-graph', chart, (svgCode) => {
        if (ref.current) {
          ref.current.innerHTML = svgCode;
        }
      });
    }
  }, [chart]);

  if (!chart) return null;

  return <div ref={ref} />;
}
