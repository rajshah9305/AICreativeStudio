// src/routes/index.ts
import { Router } from 'express';
import textRoutes from './textRoutes';
import codeRoutes from './codeRoutes';
import imageRoutes from './imageRoutes';

const router = Router();

router.use('/generate/text', textRoutes);
router.use('/generate/code', codeRoutes);
router.use('/generate/image', imageRoutes);

export default router;