import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import { validateBody } from '@/middleware/validate';
import { MediaUploadSchema } from '@vysion/shared';
import { mediaController } from '@/controllers/mediaController';

const router = Router();

// Authenticated shared route (PLAYER and SCOUT)
router.post('/upload', authenticate, validateBody(MediaUploadSchema), mediaController.uploadMetadata.bind(mediaController));

export default router;
