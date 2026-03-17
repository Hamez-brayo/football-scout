import { Router } from 'express';
import { auth } from '@/config/firebase';
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_CODES } from '@vysion/shared';
import { SignUpSchema } from '@vysion/shared';
import { validateBody } from '@/middleware/validate';
import { authenticate, authenticateJwt } from '@/middleware/auth';

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
 * POST /api/auth/session
 * Exchange a Firebase ID token for a backend application session JWT.
 * This is the only endpoint that verifies Firebase tokens directly.
 * Returns a signed backend JWT + app user; client stores the JWT and uses
 * it as Bearer token for all subsequent API requests.
 */
router.post('/session', async (req, res, next) => {
  try {
    const { idToken, firstName, lastName, userType } = req.body;

    if (!idToken) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'idToken is required',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Firebase verification happens only here — not in route middleware
    const decoded = await auth.verifyIdToken(idToken);

    // Get or create the application user record
    let user = await userService.getUserByUserId(decoded.uid).catch(() => null);

    if (!user) {
      user = await userService.createUser({
        userId: decoded.uid,
        email: decoded.email!,
        firstName: firstName ?? decoded.name?.split(' ')[0],
        lastName: lastName ?? (decoded.name?.split(' ').slice(1).join(' ') || undefined),
        userType,
      });
    }

    // Issue a backend application session JWT
    const token = authService.signSessionToken({
      userId: user.userId,
      email: user.email,
      userType: user.userType ?? undefined,
    });

    res.json({
      success: true,
      data: { user, appToken: token },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    if (error.code?.startsWith?.('auth/')) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: ERROR_CODES.INVALID_TOKEN,
          message: 'Invalid or expired Firebase ID token',
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
 * @deprecated — use POST /auth/session which also issues a backend JWT.
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

// ─── JWT-based local auth routes (isolated from Firebase-first mobile flow) ───

/**
 * POST /api/auth/local/register
 * Register with email + password (legacy local JWT flow)
 */
router.post('/local/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, userType } = req.body;

    if (!email || !password) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: { code: ERROR_CODES.VALIDATION_ERROR, message: 'email and password are required' },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const { user, token } = await authService.registerUser({
      email,
      password,
      firstName,
      lastName,
      userType,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: { user, token },
      message: 'Account created successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/local/login
 * Login with email + password, returns local JWT
 */
router.post('/local/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: { code: ERROR_CODES.VALIDATION_ERROR, message: 'email and password are required' },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const { user, token } = await authService.loginUser({ email, password });

    res.json({
      success: true,
      data: { user, token },
      message: 'Login successful',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me
 * Return authenticated user's profile (Firebase ID token required)
 */
/**
 * GET /api/auth/me
 * Return authenticated user's profile.
 * Requires a backend session JWT (obtained via POST /auth/session).
 */
router.get('/me', authenticateJwt, async (req: any, res, next) => {
  try {
    const user = await userService.getUserByUserId(req.user.userId);

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
 * GET /api/auth/local/me
 * Return authenticated user's profile (legacy local JWT flow)
 */
router.get('/local/me', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: { code: ERROR_CODES.UNAUTHORIZED, message: 'No token provided' },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const payload = authService.verifyToken(authHeader.slice(7));
    const user = await authService.getCurrentUser(payload.userId);

    res.json({
      success: true,
      data: { user },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
