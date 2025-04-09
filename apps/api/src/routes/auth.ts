import express from 'express';
import { auth } from '../config/firebase';
import { authenticateUser, AuthRequest } from '../middleware/auth';
import prisma from '../config/prisma';

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

// Sign in and get user data
router.post('/sign-in', async (req: AuthRequest, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'No token provided' });
    }

    // Verify the Firebase token
    const decodedToken = await auth.verifyIdToken(token);
    
    // Get the user's profile from Firebase
    const firebaseUser = await auth.getUser(decodedToken.uid);
    
    // Get or create user in our database
    let user = await prisma.user.findUnique({
      where: { userId: decodedToken.uid },
    });

    if (!user) {
      // Create a new user if they don't exist
      user = await prisma.user.create({
        data: {
          userId: decodedToken.uid,
          email: firebaseUser.email || '',
          fullName: firebaseUser.displayName || '',
          registrationStatus: 'INCOMPLETE',
        },
      });
    }

    // Return user data
    res.json({
      user: {
        uid: decodedToken.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        registrationStatus: user.registrationStatus,
      },
      token
    });
  } catch (error) {
    console.error('Sign-in error:', error);
    res.status(401).json({ error: 'Invalid token' });
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