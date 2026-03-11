import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import playerRoutes from './players';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Vysion Analytics API is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/players', playerRoutes);

export default router;
