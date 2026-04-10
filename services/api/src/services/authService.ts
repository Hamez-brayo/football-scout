import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/config/database';
import { config } from '@/config';
import { AppError } from '@/middleware/errorHandler';
import { HTTP_STATUS, ERROR_CODES, UserRole } from '@vysion/shared';

const SALT_ROUNDS = 12;

export interface JwtPayload {
  userId: string;
  email: string;
  role?: UserRole | null;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

function signToken(payload: JwtPayload): string {
  if (!config.JWT_SECRET) {
    throw new AppError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_ERROR,
      'JWT secret is not configured'
    );
  }

  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export const authService = {
  async registerUser(input: RegisterInput) {
    const { email, password, firstName, lastName, role } = input;

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
    const normalizedRole = role ?? UserRole.PLAYER;

    const user = await prisma.user.create({
      data: {
        userId,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        fullName:
          firstName && lastName ? `${firstName} ${lastName}` : undefined,
        role: normalizedRole,
        registrationStatus: 'INCOMPLETE',
      },
      select: {
        id: true,
        userId: true,
        email: true,
        firstName: true,
        lastName: true,
        fullName: true,
        role: true,
        registrationStatus: true,
        createdAt: true,
      },
    });

    const token = signToken({
      userId: user.userId,
      email: user.email,
      role: user.role as unknown as UserRole,
    });

    return { user, token };
  },

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
      role: user.role as unknown as UserRole,
    });

    const { password: _pw, ...safeUser } = user;
    return { user: safeUser, token };
  },

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { userId },
      include: {
        playerProfile: {
          include: {
            physicalAttributes: true,
            footballProfile: {
              include: { achievements: true },
            },
          },
        },
        media: {
          orderBy: { createdAt: 'desc' },
        },
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

  signSessionToken(payload: JwtPayload): string {
    return signToken(payload);
  },

  verifyToken(token: string): JwtPayload {
    try {
      if (!config.JWT_SECRET) {
        throw new AppError(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          ERROR_CODES.INTERNAL_ERROR,
          'JWT secret is not configured'
        );
      }

      return jwt.verify(token, config.JWT_SECRET) as unknown as JwtPayload;
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
