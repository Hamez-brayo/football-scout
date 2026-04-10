import { Router } from 'express';
import { auth } from '@/config/firebase';
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';
import {
  ERROR_CODES,
  HTTP_STATUS,
  SessionExchangeSchema,
  SignInSchema,
  SignUpSchema,
  UserRole,
  type ApiResponseEnvelope,
} from '@vysion/shared';
import { validateBody } from '@/middleware/validate';
import { authenticateJwt } from '@/middleware/auth';

const router = Router();

const ensureFirebaseAuth = () => {
  if (!auth) {
    throw new Error('Firebase Admin is not configured for this environment');
  }

  return auth;
};

router.post('/signup', validateBody(SignUpSchema), async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const role = (req.body.role ?? req.body.userType ?? UserRole.PLAYER) as UserRole;

    const firebaseAuth = ensureFirebaseAuth();

    const firebaseUser = await firebaseAuth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    const user = await userService.createUser({
      userId: firebaseUser.uid,
      email,
      firstName,
      lastName,
      role,
    });

    const customToken = await firebaseAuth.createCustomToken(firebaseUser.uid);

    const response: ApiResponseEnvelope<{ user: typeof user; token: string }> = {
      success: true,
      data: {
        user,
        token: customToken,
      },
      message: 'Account created successfully',
      timestamp: new Date().toISOString(),
    };

    res.status(HTTP_STATUS.CREATED).json(response);
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

router.post('/session', validateBody(SessionExchangeSchema), async (req, res, next) => {
  try {
    const { idToken, firstName, lastName } = req.body;
    const role = (req.body.role ?? req.body.userType ?? UserRole.PLAYER) as UserRole;

    const firebaseAuth = ensureFirebaseAuth();

    const decoded = await firebaseAuth.verifyIdToken(idToken);

    let user = await userService.getUserByUserId(decoded.uid).catch(() => null);

    if (!user) {
      user = await userService.createUser({
        userId: decoded.uid,
        email: decoded.email!,
        firstName: firstName ?? decoded.name?.split(' ')[0],
        lastName: lastName ?? (decoded.name?.split(' ').slice(1).join(' ') || undefined),
        role,
      });
    }

    const token = authService.signSessionToken({
      userId: user.userId,
      email: user.email,
      role: user.role as UserRole,
    });

    const response: ApiResponseEnvelope<{ user: typeof user; appToken: string }> = {
      success: true,
      data: { user, appToken: token },
      timestamp: new Date().toISOString(),
    };

    res.json(response);
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

router.post('/signout', async (req, res, next) => {
  try {
    const { userId } = req.body;

    const firebaseAuth = ensureFirebaseAuth();

    if (userId) {
      await firebaseAuth.revokeRefreshTokens(userId);
    }

    const response: ApiResponseEnvelope<{ signedOut: boolean }> = {
      success: true,
      data: { signedOut: true },
      message: 'Signed out successfully',
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.post('/local/register', validateBody(SignUpSchema), async (req, res, next) => {
  try {
    const role = (req.body.role ?? req.body.userType ?? UserRole.PLAYER) as UserRole;
    const { user, token } = await authService.registerUser({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role,
    });

    const response: ApiResponseEnvelope<{ user: typeof user; token: string }> = {
      success: true,
      data: { user, token },
      message: 'Account created successfully',
      timestamp: new Date().toISOString(),
    };

    res.status(HTTP_STATUS.CREATED).json(response);
  } catch (error) {
    next(error);
  }
});

router.post('/register', validateBody(SignUpSchema), async (req, res, next) => {
  try {
    const role = (req.body.role ?? req.body.userType ?? UserRole.PLAYER) as UserRole;
    const { user, token } = await authService.registerUser({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role,
    });

    const response: ApiResponseEnvelope<{ user: typeof user; token: string }> = {
      success: true,
      data: { user, token },
      message: 'Account created successfully',
      timestamp: new Date().toISOString(),
    };

    res.status(HTTP_STATUS.CREATED).json(response);
  } catch (error) {
    next(error);
  }
});

router.post('/local/login', validateBody(SignInSchema), async (req, res, next) => {
  try {
    const { user, token } = await authService.loginUser({
      email: req.body.email,
      password: req.body.password,
    });

    const response: ApiResponseEnvelope<{ user: typeof user; token: string }> = {
      success: true,
      data: { user, token },
      message: 'Login successful',
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.post('/login', validateBody(SignInSchema), async (req, res, next) => {
  try {
    const { user, token } = await authService.loginUser({
      email: req.body.email,
      password: req.body.password,
    });

    const response: ApiResponseEnvelope<{ user: typeof user; token: string }> = {
      success: true,
      data: { user, token },
      message: 'Login successful',
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticateJwt, async (req: any, res, next) => {
  try {
    const user = await userService.getUserByUserId(req.user.userId);

    const response: ApiResponseEnvelope<{ user: typeof user }> = {
      success: true,
      data: { user },
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get('/local/me', authenticateJwt, async (req: any, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.userId);

    const response: ApiResponseEnvelope<{ user: typeof user }> = {
      success: true,
      data: { user },
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
