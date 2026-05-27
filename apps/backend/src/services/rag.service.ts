import Groq from 'groq-sdk';
import config from '../config';
import { embeddingService } from './embedding.service';
import { vectorService } from './vector.service';
import { ApiError } from '../lib/errors';

class RagService {
  private groq: Groq;

  constructor() {
    if (!config.groqApiKey) {
      throw new Error('Groq API key is not configured');
    }
    this.groq = new Groq({ apiKey: config.groqApiKey });
  }

  async getRagResponse(query: string, collectionName: string): Promise<string> {
    try {
      const queryEmbedding = await embeddingService.generateEmbeddings(query);
      const contextResults = await vectorService.query(collectionName, queryEmbedding);

      const context = contextResults.metadatas[0]?.map((meta: any) => meta.content).join('\n\n');

      const prompt = `
        Context:
        ${context}
        
        Question: ${query}
        
        Answer:
      `;

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
      });

      return completion.choices[0]?.message?.content || "Sorry, I couldn't find an answer.";
    } catch (error) {
      console.error('RAG service failed:', error);
      throw new ApiError(500, 'Failed to get RAG response');
    }
  }
}

export const ragService = new RagService();
