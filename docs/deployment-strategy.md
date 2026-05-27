# Free Deployment Strategy

For the MVP, we want to keep costs as low as possible. Here is a strategy for deploying the application for free.

## Frontend (Next.js)

*   **Vercel:** Vercel is the company behind Next.js and offers a generous free tier for personal projects and open-source. It's the most straightforward way to deploy a Next.js application.
    *   **Features:** Automatic deployments from GitHub, global CDN, serverless functions for API routes.

## Backend (Node.js + Express)

We have a few options for deploying the backend for free.

*   **Render:** Render offers a free tier for web services that includes a PostgreSQL database. The free tier has some limitations (e.g., the service spins down after a period of inactivity), but it's a good option for an MVP.
*   **Fly.io:** Fly.io has a "free forever" tier that allows you to deploy small applications. You can deploy Docker containers, which gives us a lot of flexibility.
*   **Vercel Serverless Functions:** We could potentially refactor our backend to run as serverless functions on Vercel. This would simplify our deployment architecture, but might require some changes to our backend code.

**Recommendation:** For the MVP, **Render** is a good choice. It's easy to use and the free tier is sufficient for our initial needs.

## Vector Database (ChromaDB)

*   **Local Instance on the Backend Server:** Since we are using a local ChromaDB instance, it will be deployed as part of our backend service. When the backend is deployed to a platform like Render, the ChromaDB data will be stored on the instance's disk.
*   **Important Consideration:** The free tiers of hosting platforms often have ephemeral filesystems. This means that if the service restarts, the ChromaDB data might be lost. For the MVP, this is an acceptable risk. For a production application, we would need to use a managed vector database or a persistent storage solution.

## Deployment Workflow

1.  **Containerize the Backend:** Create a `Dockerfile` for the backend application. This will make it easy to deploy to any platform that supports Docker.
2.  **Set up GitHub Actions:** Create a GitHub Actions workflow to automatically build and deploy the frontend to Vercel and the backend to Render whenever we push to the `main` branch.
3.  **Configure Environment Variables:** Store API keys and other secrets as environment variables in Vercel and Render.
