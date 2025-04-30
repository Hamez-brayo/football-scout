import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateUser, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Update user profile
router.put('/:userId/profile', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;
    const profileData = req.body;

    // Verify user is updating their own profile
    if (userId !== req.user!.uid) {
      return res.status(403).json({ error: 'Unauthorized to update this profile' });
    }

    const user = await prisma.user.update({
      where: { userId },
      data: {
        ...profileData,
        updatedAt: new Date(),
      },
    });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user profile
router.get('/:userId/profile', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;

    // Verify user is requesting their own profile
    if (userId !== req.user!.uid) {
      return res.status(403).json({ error: 'Unauthorized to access this profile' });
    }

    const user = await prisma.user.findUnique({
      where: { userId },
      include: {
        physicalAttributes: true,
        footballProfile: {
          include: {
            achievements: true
          }
        },
        availability: true,
        socialLinks: true,
        privacySettings: true,
        media: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router; 