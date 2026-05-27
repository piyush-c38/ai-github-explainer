import { ChromaClient, Collection } from 'chromadb';
import { ApiError } from '../lib/errors';

class VectorService {
  private client: ChromaClient;
  private collection: Collection | null = null;

  constructor() {
    this.client = new ChromaClient();
  }

  async getOrCreateCollection(name: string): Promise<Collection> {
    try {
      this.collection = await this.client.getOrCreateCollection({ name });
      return this.collection;
    } catch (error) {
      console.error('Failed to get or create collection:', error);
      throw new ApiError(500, 'Failed to get or create ChromaDB collection');
    }
  }

  async addDocuments(
    collectionName: string,
    documents: { id: string; embedding: number[]; metadata: any }[]
  ) {
    if (!this.collection || this.collection.name !== collectionName) {
      this.collection = await this.getOrCreateCollection(collectionName);
    }

    const ids = documents.map(doc => doc.id);
    const embeddings = documents.map(doc => doc.embedding);
    const metadatas = documents.map(doc => doc.metadata);

    try {
      await this.collection.add({
        ids,
        embeddings,
        metadatas,
      });
    } catch (error) {
      console.error('Failed to add documents to ChromaDB:', error);
      throw new ApiError(500, 'Failed to add documents to ChromaDB');
    }
  }

  async query(collectionName: string, queryEmbedding: number[], nResults = 5) {
    if (!this.collection || this.collection.name !== collectionName) {
      this.collection = await this.getOrCreateCollection(collectionName);
    }

    try {
      const results = await this.collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults,
      });
      return results;
    } catch (error) {
      console.error('Failed to query ChromaDB:', error);
      throw new ApiError(500, 'Failed to query ChromaDB');
    }
  }
}

export const vectorService = new VectorService();
