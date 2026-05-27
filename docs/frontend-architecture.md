# Frontend Architecture

## Overview

The frontend will be a Next.js application with TypeScript. It will be responsible for the user interface, handling user input, and displaying the analysis results.

## Tech Stack

*   **Framework:** Next.js
*   **Language:** TypeScript
*   **UI Library:** React
*   **Styling:** Tailwind CSS
*   **State Management:** React Context / Zustand (for more complex state)
*   **Data Fetching:** SWR / React Query
*   **Visualization:** React Flow, Mermaid

## Folder Structure

```
apps/frontend/
├── src/
│   ├── app/
│   │   ├── api/         # API routes (Next.js App Router)
│   │   ├── (main)/      # Main application routes
│   │   │   ├── [repo]/  # Dynamic route for repository analysis
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   └── page.tsx     # Landing page
│   ├── components/
│   │   ├── ui/          # Shared UI components (from packages/ui)
│   │   ├── graphs/      # Graph visualization components
│   │   └── specific/    # Components for specific features
│   ├── lib/             # Library functions, helpers
│   ├── hooks/           # Custom React hooks
│   ├── styles/          # Global styles
│   └── types/           # TypeScript types and interfaces
├── public/              # Static assets
├── next.config.js
├── package.json
└── tsconfig.json
```

## Key Components

*   **RepoInput:** A component for users to input a GitHub repository URL.
*   **AnalysisDashboard:** The main dashboard that displays the repository analysis, including folder structure, dependencies, and code flow.
*   **ArchitectureDiagram:** A component that renders the architecture diagram using Mermaid.
*   **InteractiveGraph:** A component that displays interactive graphs using React Flow.
*   **ChatInterface:** A component for the RAG-based repository chat.

## State Management

For simple state, we will use React's built-in state management (`useState`, `useReducer`, `useContext`). For more complex global state, such as the analysis results or chat history, we will use Zustand for its simplicity and performance.

## Data Flow

1.  User enters a GitHub repository URL.
2.  The frontend sends a request to the backend API to start the analysis.
3.  The backend processes the repository and stores the analysis results.
4.  The frontend fetches the analysis results from the backend and displays them in the dashboard.
5.  For the chat feature, the frontend sends user queries to the backend, which uses the RAG pipeline to generate responses.
