import { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { encodeRepoPath } from '@/lib/routes';

interface Props {
  className?: string;
  autoFocus?: boolean;
}

export default function RepoInput({ className, autoFocus }: Props) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const trimmed = url.trim();
    if (!/^https?:\/\/(www\.)?github\.com\/[^/]+\/[^/]+/.test(trimmed)) {
      setError('Please paste a valid GitHub repo URL (https://github.com/owner/repo).');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: trimmed }),
      });

      if (!response.ok) {
        throw new Error('Failed to start analysis.');
      }

      const data = await response.json();
      const repoPath = trimmed.replace('https://github.com/', '');
      const encodedRepo = encodeRepoPath(repoPath);
      await router.push(`/dashboard/${data.analysisId}/${encodedRepo}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className={cn('w-full', className)}>
      <div className="group relative rounded-2xl p-[1px] transition-all" style={{ background: 'var(--gradient-primary)' }}>
        <div className="flex items-center gap-2 rounded-2xl bg-card px-4 py-3">
          <Sparkles className="size-5 shrink-0 text-primary" />
          <input
            autoFocus={autoFocus}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Paste a GitHub repo URL — e.g. github.com/vercel/next-commerce"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground md:text-base"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
            <span className="hidden sm:inline">{loading ? 'Analyzing' : 'Explain'}</span>
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      <p className="mt-2 text-xs text-muted-foreground">Tip: leave empty to try the demo repo.</p>
    </form>
  );
}
