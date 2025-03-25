import express from 'express';
import { auth } from '../config/firebase';
import { authenticateUser, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get current user profile
router.get('/me', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const user = await auth.getUser(req.user!.uid);
    res.json({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// Update user profile
router.put('/me', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const { displayName, photoURL } = req.body;
    const user = await auth.updateUser(req.user!.uid, {
      displayName,
      photoURL,
    });
    res.json({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user profile' });
  }
});

export default router; 