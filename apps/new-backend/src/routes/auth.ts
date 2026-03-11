import { Router } from 'express';
import { auth } from '@/config/firebase';
import { userService } from '@/services/userService';
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_CODES } from '@vysion/shared';
import { SignUpSchema, SignInSchema } from '@vysion/shared';
import { validateBody } from '@/middleware/validate';

const router = Router();

/**
 * POST /api/auth/signup
 * Create a new user account
 */
router.post('/signup', validateBody(SignUpSchema), async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, userType } = req.body;

    // Create Firebase user
    const firebaseUser = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Create user in database
    const user = await userService.createUser({
      userId: firebaseUser.uid,
      email,
      firstName,
      lastName,
      userType,
    });

    // Generate custom token
    const customToken = await auth.createCustomToken(firebaseUser.uid);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: {
        user,
        token: customToken,
      },
      message: 'Account created successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        error: {
          code: ERROR_CODES.ALREADY_EXISTS,
          message: 'Email already in use',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }
    next(error);
  }
});

/**
 * POST /api/auth/verify-token
 * Verify Firebase ID token and get/create user
 */
router.post('/verify-token', async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'ID token is required',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Verify token
    const decodedToken = await auth.verifyIdToken(idToken);

    // Get or create user in database
    let user = await userService.getUserByUserId(decodedToken.uid).catch(() => null);

    if (!user) {
      // Create user if doesn't exist
      user = await userService.createUser({
        userId: decodedToken.uid,
        email: decodedToken.email!,
        firstName: decodedToken.name?.split(' ')[0],
        lastName: decodedToken.name?.split(' ').slice(1).join(' '),
      });
    }

    res.json({
      success: true,
      data: { user },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/signout
 * Revoke refresh tokens
 */
router.post('/signout', async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (userId) {
      await auth.revokeRefreshTokens(userId);
    }

    res.json({
      success: true,
      message: 'Signed out successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
