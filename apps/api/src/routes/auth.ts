import express, { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import { authenticateUser, AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

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
router.post('/sign-in', async (req: Request, res) => {
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
        where: { userId: decodedToken.uid },
      });

      if (!user) {
        // Create a new user with minimal required fields
        user = await prisma.user.create({
          data: {
            email: firebaseUser.email || '',
            userId: decodedToken.uid,
            fullName: firebaseUser.displayName || '',
            registrationStatus: isSignUp ? 'INCOMPLETE' : 'COMPLETE',
            userType: 'TALENT', // Default type
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
        error: 'Database connection error. Please ensure PostgreSQL is running and credentials are correct.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      });
    }
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

// Google Sign-in endpoint
router.post('/google-sign-in', async (req: Request, res) => {
  try {
    const { token, email, displayName, photoURL } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'No token provided' });
    }

    // Verify the Firebase token
    const decodedToken = await auth.verifyIdToken(token);
    
    try {
      // Get or create user in our database
      let user = await prisma.user.findUnique({
        where: { userId: decodedToken.uid },
      });

      if (!user) {
        // Create a new user
        user = await prisma.user.create({
          data: {
            email,
            userId: decodedToken.uid,
            fullName: displayName,
            registrationStatus: 'INCOMPLETE',
            userType: 'TALENT', // Default type
          },
        });
      }

      // Return user data
      res.json({
        user: {
          uid: decodedToken.uid,
          email: email,
          displayName: displayName,
          photoURL: photoURL,
          registrationStatus: user.registrationStatus,
          userType: user.userType
        }
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
    console.error('Google sign-in error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown authentication error';
    res.status(401).json({ 
      error: 'Authentication failed',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // ... existing code ...
});

export default router; 