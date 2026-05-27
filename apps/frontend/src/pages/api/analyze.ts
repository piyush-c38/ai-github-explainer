import type { NextApiRequest, NextApiResponse } from 'next';

// This API route proxies requests to the backend to start an analysis.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ message: 'Repository URL is required' });
  }

  try {
    const backendResponse = await fetch('http://localhost:3001/api/repo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return res.status(backendResponse.status).json(errorData);
    }

    const data = await backendResponse.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
