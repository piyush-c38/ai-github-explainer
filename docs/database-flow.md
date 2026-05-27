# Database/Vector DB Flow

## Overview

We will use a local ChromaDB instance as our vector database. The primary purpose of the database is to store the embeddings for the RAG pipeline. We will also use a simple file-based or in-memory cache for the analysis results to avoid re-processing the same repository multiple times.

## ChromaDB Flow

1.  **Initialization:** The backend will initialize the ChromaDB client.
2.  **Collection Creation:** For each new repository analysis, a new collection will be created in ChromaDB. The collection name can be based on the repository URL or a unique ID.
3.  **Indexing:**
    *   The parser pipeline generates text chunks from the repository's code and documentation.
    *   An embedding model (e.g., a sentence-transformer) converts these text chunks into vector embeddings.
    *   The `db-client` package batches these embeddings and upserts them into the corresponding ChromaDB collection, along with the original text as metadata.
4.  **Querying:**
    *   When a user sends a chat message, the `ChatService` uses the embedding model to create an embedding for the user's query.
    *   The `db-client` queries the ChromaDB collection to find the `k` most similar vectors.
    *   The text chunks associated with these vectors are retrieved from the metadata.
5.  **Cleanup:** We might need a strategy to clean up old collections to manage disk space, but this is out of scope for the MVP.

## Analysis Cache

To avoid re-analyzing a repository every time a user requests it, we will implement a simple caching mechanism.

*   **Cache Key:** The GitHub repository URL.
*   **Cache Value:** The analysis results.
*   **Implementation:** For the MVP, we can use a simple in-memory cache (e.g., a `Map`) or a file-based cache where the analysis results are stored as JSON files. For a more robust solution, we could use a database like Redis, but that is out of scope for the MVP.

When a request to analyze a repository comes in, we first check the cache. If the results are present, we return them directly. Otherwise, we proceed with the analysis and store the results in the cache upon completion.
