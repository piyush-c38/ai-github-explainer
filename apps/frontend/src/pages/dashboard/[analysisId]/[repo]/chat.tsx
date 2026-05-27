import { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { analysisId } = router.query;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId, query: input }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'ai' as const, content: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'ai' as const, content: 'Sorry, something went wrong.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-4">Chat with the repo</h1>
        <div className="flex-1 overflow-y-auto bg-surface-1 p-4 rounded-lg border border-outline mb-4">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
              >
                <div
                  className={`p-3 rounded-lg max-w-lg ${
                    msg.role === 'user'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-2 text-on-surface'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-lg bg-surface-2 text-on-surface">Typing...</div>
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSendMessage}>
          <div className="flex items-center bg-surface-1 border border-outline rounded-full p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about the code..."
              className="w-full px-4 py-2 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 bg-primary rounded-full text-on-primary disabled:bg-gray-500"
              disabled={!input.trim() || isLoading}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
