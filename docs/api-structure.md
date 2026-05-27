# API Structure

## Overview

The backend will expose a RESTful API for the frontend to consume.

## Endpoints

### `POST /api/repo`

*   **Description:** Initiates the analysis of a GitHub repository.
*   **Request Body:**
    ```json
    {
      "url": "https://github.com/owner/repo"
    }
    ```
*   **Response:**
    ```json
    {
      "analysisId": "some-unique-id"
    }
    ```

### `GET /api/repo/:analysisId`

*   **Description:** Retrieves the analysis results for a repository.
*   **Parameters:**
    *   `analysisId`: The ID of the analysis.
*   **Response:**
    ```json
    {
      "status": "completed", // or "pending", "failed"
      "analysis": {
        "folderStructure": { ... },
        "dependencies": { ... },
        "codeFlow": { ... },
        "importantFiles": [ ... ],
        "onboardingPath": { ... },
        "techStack": [ ... ],
        "possibleBugs": [ ... ],
        "futureMvpOpportunities": [ ... ],
        "mermaidDiagram": "graph TD; A-->B;"
      }
    }
    ```

### `POST /api/chat`

*   **Description:** Handles chat messages for the RAG-based chat.
*   **Request Body:**
    ```json
    {
      "analysisId": "some-unique-id",
      "message": "What is the purpose of the main function?"
    }
    ```
*   **Response:**
    ```json
    {
      "reply": "The main function is the entry point of the application..."
    }
    ```
