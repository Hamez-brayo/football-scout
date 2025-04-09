import { Router } from 'express';
import { auth } from '../config/firebase';
import prisma from '../config/database';

const router = Router();

// Sign in and get user data
router.post('/sign-in', async (req, res) => {
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
      where: { id: decodedToken.uid },
    });

    if (!user) {
      // Create a new user if they don't exist
      user = await prisma.user.create({
        data: {
          id: decodedToken.uid,
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

export default router; 