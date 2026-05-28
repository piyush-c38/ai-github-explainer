# API Connection Flow

This document outlines the sequence of API calls between the user's browser, the Next.js frontend, and the Express backend.

```mermaid
sequenceDiagram
    participant User
    participant Frontend (Next.js)
    participant API Proxy (Next.js)
    participant Backend (Express)

    User->>Frontend: Enters GitHub URL and clicks "Analyze"
    Frontend->>API Proxy: POST /api/start-analysis { repoUrl: "..." }
    API Proxy->>Backend: POST /api/repo/analyze { repoUrl: "..." }
    Backend-->>API Proxy: 202 Accepted { analysisId: "...", status: "pending" }
    API Proxy-->>Frontend: { analysisId: "...", status: "pending" }
    Frontend->>User: Redirects to /dashboard/{analysisId}

    loop Polling for results
        Frontend->>API Proxy: GET /api/analysis/{analysisId}
        API Proxy->>Backend: GET /api/repo/{analysisId}
        alt Analysis In Progress
            Backend-->>API Proxy: { status: "processing", progress: "..." }
            API Proxy-->>Frontend: { status: "processing", progress: "..." }
        else Analysis Complete
            Backend-->>API Proxy: { status: "completed", data: { ... } }
            API Proxy-->>Frontend: { status: "completed", data: { ... } }
            Frontend->>User: Displays visualizations
            break
        end
    end

    Note over Frontend, Backend: Polling stops once status is "completed".

    User->>Frontend: Enters a question in the chat box
    Frontend->>API Proxy: POST /api/chat { analysisId: "...", message: "..." }
    API Proxy->>Backend: POST /api/repo/{analysisId}/chat { message: "..." }
    Backend-->>API Proxy: { reply: "..." }
    API Proxy-->>Frontend: { reply: "..." }
    Frontend->>User: Displays AI's response
```

## Flow Explanation

1.  **Start Analysis**:
    *   The user submits a GitHub repository URL on the frontend.
    *   The frontend makes a `POST` request to its own API route (`/api/start-analysis`). This is a Next.js API route acting as a proxy.
    *   The proxy forwards this request to the backend's `/api/repo/analyze` endpoint.
    *   The backend immediately responds with a `202 Accepted` status, including a unique `analysisId`. It then starts the cloning and analysis process asynchronously.
    *   The frontend receives the `analysisId` and redirects the user to the dashboard page for that analysis.

2.  **Polling for Status & Results**:
    *   The dashboard page uses the `useAnalysis` SWR hook to periodically poll the frontend's `/api/analysis/[analysisId]` endpoint.
    *   This proxy endpoint, in turn, calls the backend's `/api/repo/[analysisId]` endpoint to get the latest status.
    *   While the analysis is running, the backend returns a `status` of `"processing"` with progress details.
    *   Once the analysis is finished, the backend returns a `status` of `"completed"` along with the full analysis data (file structure, dependencies, etc.).
    *   The SWR hook on the frontend sees the `"completed"` status, stops polling, and re-renders the components with the final data to display the visualizations.

3.  **Chat (RAG)**:
    *   When the user sends a message in the chat interface, the frontend makes a `POST` request to `/api/chat`.
    *   This proxy forwards the message to the backend's `/api/repo/[analysisId]/chat` endpoint.
    *   The backend uses its RAG service (ChromaDB + Groq) to find relevant code context and generate a response.
    *   The response is streamed back to the frontend and displayed to the user.

This proxy-based approach is used to:
*   Avoid CORS issues between the frontend and backend.
*   Hide the backend URL from the client-side code.
*   Keep all API interactions centralized within the Next.js application.
