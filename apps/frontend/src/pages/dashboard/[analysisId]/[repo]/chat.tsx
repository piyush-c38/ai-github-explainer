import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageHeader, PageShell } from '@/components/page-header';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';

type Msg = { role: 'user' | 'assistant'; content: string };

const sampleQuestions = [
  'How does the cart state work?',
  'Where do API calls happen?',
  'What runs at build time vs runtime?',
  'Walk me through the main request flow.',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { analysisId } = router.query;
  const analysisIdParam = Array.isArray(analysisId) ? analysisId[0] : analysisId;

  const { data } = useSWR(
    analysisIdParam ? `/api/analysis/${analysisIdParam}` : null,
    fetcher
  );

  useEffect(() => {
    if (!analysisIdParam || messages.length > 0 || !data?.repoUrl) return;
    const repoName = data.repoUrl.replace('https://github.com/', '');
    setMessages([
      {
        role: 'assistant',
        content: `Hi! I've indexed ${repoName}. Ask me about architecture, files, dependencies, or how a feature flows through the codebase.`,
      },
    ]);
  }, [analysisIdParam, data?.repoUrl, messages.length]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    if (!analysisIdParam) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId: analysisIdParam, query: text }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <PageShell>
        <PageHeader
          eyebrow="AI Chat"
          title="Ask the repository anything"
          description="Grounded in the repo's files via RAG."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="flex h-[600px] flex-col rounded-2xl border border-border bg-card">
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div
                      className="grid size-8 shrink-0 place-items-center rounded-lg"
                      style={{ background: 'var(--gradient-primary)' }}
                    >
                      <span className="text-xs text-primary-foreground">AI</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="grid size-8 place-items-center rounded-lg" style={{ background: 'var(--gradient-primary)' }}>
                    <span className="text-xs text-primary-foreground">AI</span>
                  </div>
                  <div className="rounded-2xl bg-secondary px-4 py-2.5 text-sm text-muted-foreground">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                send(input);
              }}
              className="flex gap-2 border-t border-border p-3"
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about architecture, files, flows..."
                className="flex-1 rounded-xl bg-secondary px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                disabled={!analysisIdParam}
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                disabled={!input.trim() || isLoading || !analysisIdParam}
              >
                Send
              </button>
            </form>
          </div>

          <aside className="h-fit space-y-3 rounded-2xl border border-border bg-card p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Try asking</div>
            {sampleQuestions.map((question) => (
              <button
                key={question}
                onClick={() => send(question)}
                className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-left text-sm transition hover:bg-secondary"
                disabled={!analysisIdParam}
              >
                {question}
              </button>
            ))}
          </aside>
        </div>
      </PageShell>
    </DashboardLayout>
  );
}
