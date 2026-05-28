import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const config = {
  groqApiKey: process.env.GROQ_API_KEY,
  githubToken: process.env.GITHUB_TOKEN,
  chromaUrl: process.env.CHROMA_URL,
  clonePath: process.env.CLONE_PATH || '/tmp/ai-github-explainer-clones',
  port: process.env.PORT || 3001,
};

export default config;
