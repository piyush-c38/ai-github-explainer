# Backend Architecture

## Overview

The backend will be a Node.js application using the Express framework. It will be responsible for handling API requests from the frontend, interacting with the GitHub API, managing the code parsing pipeline, and interacting with the vector database.

## Tech Stack

*   **Framework:** Express.js
*   **Language:** TypeScript
*   **Runtime:** Node.js
*   **API:** RESTful API

## Folder Structure

```
apps/backend/
├── src/
│   ├── api/
│   │   ├── routes/      # API route definitions
│   │   └── controllers/ # Route handlers
│   ├── services/        # Business logic (e.g., GitHub service, analysis service)
│   ├── lib/             # Library functions, helpers
│   ├── config/          # Application configuration
│   ├── types/           # TypeScript types and interfaces
│   └── index.ts         # Application entry point
├── package.json
└── tsconfig.json
```

## Key Services

*   **GitHubService:** Interacts with the GitHub API to fetch repository data.
*   **AnalysisService:** Manages the repository analysis process, orchestrating the parser and database client.
*   **ChatService:** Handles the RAG-based chat functionality.
*   **VectorDBService:** Interacts with the ChromaDB vector database.

## API Endpoints

*   `POST /api/repo`: Initiates the analysis of a GitHub repository.
*   `GET /api/repo/:repoId`: Retrieves the analysis results for a repository.
*   `POST /api/chat`: Handles chat messages for the R-AG-based chat.

## Authentication

For the initial MVP, we will not implement user authentication. However, we will use API keys to protect the API endpoints.

## Error Handling

We will implement a centralized error handling middleware to catch and handle errors in a consistent way.
