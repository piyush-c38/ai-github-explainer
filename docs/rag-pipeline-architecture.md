# RAG Pipeline Architecture

## Overview

The Retrieval-Augmented Generation (RAG) pipeline will power the repository chat feature. It will allow users to ask questions about the repository in natural language.

## Tech Stack

*   **LLM:** Groq APIs
*   **Vector Database:** ChromaDB (local)
*   **Embeddings:** A sentence-transformer model (e.g., from Hugging Face)

## Pipeline Stages

1.  **Indexing:**
    *   The parsed code and documentation from the repository will be chunked into smaller pieces.
    *   Each chunk will be converted into a vector embedding using a sentence-transformer model.
    *   The embeddings and the corresponding text chunks will be stored in ChromaDB.

2.  **Retrieval:**
    *   When a user asks a question, the question will be converted into a vector embedding.
    *   ChromaDB will be queried to find the most similar text chunks (i.e., the most relevant context).

3.  **Generation:**
    *   The retrieved text chunks will be combined with the user's question to form a prompt for the Groq LLM.
    *   The LLM will generate a response based on the provided context.

## Prompt Engineering

The quality of the generated responses will depend heavily on the quality of the prompts. We will need to experiment with different prompt templates to find the most effective ones. The prompt should clearly instruct the LLM to use the provided context to answer the question.

## Package: `packages/db-client`

This package will contain the logic for interacting with ChromaDB, including indexing and retrieval. The `ChatService` in the backend will use this package.
