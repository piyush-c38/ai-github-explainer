# Frontend Deployment: Vercel

Deploying the Next.js frontend to Vercel is straightforward, as Vercel is optimized for Next.js applications.

## Vercel Project Configuration

1.  **Import Project**:
    *   Connect your GitHub account to Vercel.
    *   Click "Add New..." -> "Project".
    *   Select the `ai-github-explainer` repository.

2.  **Configure Project**:
    *   **Framework Preset**: Vercel should automatically detect `Next.js`.
    *   **Root Directory**: Set the root directory to `apps/frontend`. This is the most important step. It tells Vercel that the Next.js project is inside the `apps/frontend` folder of the monorepo.
    *   **Build and Output Settings**: Vercel's defaults for Next.js are usually correct. No changes are typically needed here.
    *   **Environment Variables**:
        *   You need to tell the frontend where the *production* backend is located.
        *   Add an environment variable:
            *   **Name**: `NEXT_PUBLIC_BACKEND_API_URL`
            *   **Value**: The URL of your deployed backend service (e.g., `https://your-backend-service.onrender.com`).

3.  **Deploy**:
    *   Click "Deploy". Vercel will automatically install dependencies (from the root `package.json`), build the Next.js app, and deploy it.

## API Proxy and CORS

The frontend uses Next.js API routes as a proxy to the backend. This means the browser only ever communicates with the Vercel-hosted Next.js app, which then securely communicates with the backend on the server side.

This setup has two main benefits in production:

1.  **No CORS Issues**: Since the browser isn't calling a different domain (`your-backend-service.onrender.com`), you don't need to configure CORS on the backend. The API calls are same-origin from the browser's perspective.
2.  **Hides Backend URL**: The backend's URL is stored in a server-side environment variable on Vercel and is not exposed to the client.

The API proxy routes in `apps/frontend/src/pages/api/` are already configured to use the `NEXT_PUBLIC_BACKEND_API_URL` environment variable when making requests to the backend. When you set this variable in Vercel's project settings, the deployed frontend will automatically connect to your production backend.
