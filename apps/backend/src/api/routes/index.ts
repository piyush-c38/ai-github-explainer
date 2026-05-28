import { Router } from 'express';
import repoRoutes from './repoRoutes';

const router = Router();

router.use('/repo', repoRoutes);

export default router;
