import { Router } from 'express';
import userRoutes from './user.routes';

const router = Router();

// API routes
router.use('/api/users', userRoutes);

export default router; 