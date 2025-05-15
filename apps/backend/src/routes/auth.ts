import { Router } from 'express';
import { auth } from '../config/firebase';
import prisma from '../config/database';
import { UserType } from '@prisma/client';

const router = Router();

// Sign in and get user data
router.post('/sign-in', async (req, res) => {
  try {
    const { token, isSignUp } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'No token provided' });
    }

    // Verify the Firebase token
    const decodedToken = await auth.verifyIdToken(token);
    
    // Get the user's profile from Firebase
    const firebaseUser = await auth.getUser(decodedToken.uid);
    
    try {
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
            registrationStatus: isSignUp ? 'PENDING' : 'COMPLETE',
            userType: UserType.TALENT, // Default type
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
          userType: user.userType
        },
        token
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error';
      res.status(500).json({ 
        error: 'Database error',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      });
    }
  } catch (error) {
    console.error('Sign-in error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown authentication error';
    res.status(401).json({ 
      error: 'Authentication failed',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

export default router; 