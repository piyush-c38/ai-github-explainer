import { Router, Request, Response } from 'express';
import { handleErrors, ApiError } from '../lib/errors';
import { analysisService } from '../services/analysis.service';
import { ragService } from '../services/rag.service';

const router = Router();

router.post(
  '/repo',
  handleErrors(async (req: Request, res: Response) => {
    const { url } = req.body;
    if (!url) {
      throw new ApiError(400, 'Repository URL is required');
    }
    const result = await analysisService.analyzeRepo(url);
    res.json(result);
  })
);

router.post(
  '/chat',
  handleErrors(async (req: Request, res: Response) => {
    const { query, collectionName } = req.body;
    if (!query || !collectionName) {
      throw new ApiError(400, 'Query and collectionName are required');
    }
    const reply = await ragService.getRagResponse(query, collectionName);
    res.json({ reply });
  })
);

export default router;
