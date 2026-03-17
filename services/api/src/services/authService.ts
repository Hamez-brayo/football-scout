import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/config/database';
import { config } from '@/config';
import { AppError } from '@/middleware/errorHandler';
import { HTTP_STATUS, ERROR_CODES } from '@vysion/shared';

const SALT_ROUNDS = 12;

export interface JwtPayload {
  userId: string;
  email: string;
  userType?: string | null;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  userType?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export const authService = {
  /**
   * Register a new user with email + password.
   * Generates a cuid-compatible userId so the record is compatible with
   * Firebase-created users should they be merged later.
   */
  async registerUser(input: RegisterInput) {
    const { email, password, firstName, lastName, userType } = input;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError(
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.ALREADY_EXISTS,
        'An account with this email already exists'
      );
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const userId = uuidv4();

    const user = await prisma.user.create({
      data: {
        userId,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        fullName:
          firstName && lastName ? `${firstName} ${lastName}` : undefined,
        userType: (userType as any) || undefined,
        registrationStatus: 'INCOMPLETE',
      },
      select: {
        id: true,
        userId: true,
        email: true,
        firstName: true,
        lastName: true,
        fullName: true,
        userType: true,
        registrationStatus: true,
        createdAt: true,
      },
    });

    const token = signToken({
      userId: user.userId,
      email: user.email,
      userType: user.userType,
    });

    return { user, token };
  },

  /**
   * Authenticate an existing user.
   * Only works for locally-registered users (password IS set).
   */
  async loginUser(input: LoginInput) {
    const { email, password } = input;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.UNAUTHORIZED,
        'Invalid email or password'
      );
    }

    if (!user.password) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.UNAUTHORIZED,
        'This account uses a different sign-in method'
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.UNAUTHORIZED,
        'Invalid email or password'
      );
    }

    const token = signToken({
      userId: user.userId,
      email: user.email,
      userType: user.userType,
    });

    // Strip password from returned object
    const { password: _pw, ...safeUser } = user;
    return { user: safeUser, token };
  },

  /**
   * Retrieve the current user by userId from a decoded JWT payload.
   */
  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        email: true,
        firstName: true,
        lastName: true,
        fullName: true,
        userType: true,
        registrationStatus: true,
        verificationStatus: true,
        profilePhoto: true,
        nationality: true,
        position: true,
        currentClub: true,
        createdAt: true,
        updatedAt: true,
        physicalAttributes: true,
        footballProfile: {
          include: { achievements: true },
        },
        availability: true,
        socialLinks: true,
      },
    });

    if (!user) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
        'User not found'
      );
    }

    return user;
  },

  /**
   * Issue a signed application session JWT.
   * Used by POST /auth/session after Firebase ID token verification.
   */
  signSessionToken(payload: JwtPayload): string {
    return signToken(payload);
  },

  /**
   * Verify a JWT and return its decoded payload.
   */
  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_CODES.TOKEN_EXPIRED,
          'Token has expired'
        );
      }
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.INVALID_TOKEN,
        'Invalid token'
      );
    }
  },
};
