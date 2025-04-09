import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth';

const router = Router();

// API routes
router.use('/api/users', userRoutes);
router.use('/api/auth', authRoutes);

export default router; 