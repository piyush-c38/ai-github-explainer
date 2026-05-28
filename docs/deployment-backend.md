# Backend Deployment: Render

This guide explains how to deploy the Node.js/Express backend to Render. Render is a good choice because it supports monorepos and background workers, which fits our project structure.

## Render Project Configuration

1.  **Create a New Web Service**:
    *   From the Render dashboard, click "New" -> "Web Service".
    *   Connect your GitHub account and select the `ai-github-explainer` repository.

2.  **Configure the Service**:
    *   **Name**: Give your service a name (e.g., `ai-explainer-backend`).
    *   **Region**: Choose a region close to your users.
    *   **Branch**: Select your main branch (e.g., `main`).
    *   **Root Directory**: Set this to `apps/backend`. This tells Render to look for the service within this sub-directory of the monorepo.
    *   **Runtime**: Select `Node`.
    *   **Build Command**:
        ```bash
        npm install && npm run build
        ```
        This command needs to be run from the `apps/backend` directory. Render automatically handles `cd`ing into the `Root Directory` before running the build command. The `npm install` will actually run from the monorepo root, which is what we want.
    *   **Start Command**:
        ```bash
        node dist/index.js
        ```
        This command starts the compiled server from the `dist` folder.
    *   **Instance Type**: The "Free" plan is sufficient for this MVP.

3.  **Add Environment Variables**:
    *   Go to the "Environment" tab for your new service.
    *   Add the following secret:
        *   **Key**: `GROQ_API_KEY`
        *   **Value**: Your Groq API key (`gsk_...`)

4.  **Deploy**:
    *   Click "Create Web Service". Render will pull the code, run the build command, and start the service.

## Important Considerations

*   **Health Check**: Render will ping the root URL (`/`) of your service to check if it's healthy. Our backend doesn't have a route at `/`, but it does have `/api/repo/health`. You can either add a `/` route to `apps/backend/src/index.ts` that returns a `200 OK`, or you can configure Render's health check path to `/api/repo/health`.
*   **CORS**: Since our frontend is using a proxy, we do **not** need to configure CORS on the backend. The backend only needs to accept requests from our Vercel-hosted frontend, which happens server-to-server.
*   **Temporary Storage**: The backend clones GitHub repositories into a temporary directory. Render's instances have an ephemeral filesystem, meaning any files written to it will be lost on the next deploy or restart. This is perfectly fine for our use case, as the cloned repository is only needed for the duration of the analysis.

## Alternative: Railway

Railway is another excellent platform for deploying this kind of service. The setup is very similar:

1.  Create a new project and link your GitHub repository.
2.  When a new service is detected, configure its settings.
3.  **Set the Root Directory** to `apps/backend`.
4.  **Configure the Build and Start commands** similar to the Render setup.
5.  **Add the `GROQ_API_KEY`** as a service variable.

Both platforms will provide a public URL for your backend (e.g., `https://ai-explainer-backend.onrender.com`). This is the URL you will use for the `NEXT_PUBLIC_BACKEND_API_URL` environment variable in your Vercel frontend project.
