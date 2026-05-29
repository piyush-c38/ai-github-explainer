import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { encodeRepoPath } from '@/lib/routes';

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) return;
    console.log('Submitting repo URL:', repoUrl);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: repoUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to start analysis.');
      }

      const data = await response.json();
      const repoPath = repoUrl.replace('https://github.com/', '');
      const encodedRepo = encodeRepoPath(repoPath);
      router.push(`/dashboard/${data.analysisId}/${encodedRepo}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold text-primary mb-4">
          AI GitHub Repository Explainer
        </h1>
        <p className="text-lg text-on-surface-variant">
          Get a deep understanding of any public GitHub repository.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-center bg-surface-1 border border-outline rounded-full shadow-lg overflow-hidden p-2">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              className="w-full px-4 py-2 bg-transparent focus:outline-none text-on-surface"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-on-primary font-semibold rounded-full hover:bg-blue-500 transition-colors duration-300 disabled:bg-gray-500"
              disabled={isLoading}
            >
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </motion.div>
    </div>
  );
}
