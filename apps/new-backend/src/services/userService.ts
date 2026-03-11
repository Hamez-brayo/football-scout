import { prisma } from '@/config/database';
import { AppError } from '@/middleware/errorHandler';
import { HTTP_STATUS, ERROR_CODES } from '@vysion/shared';
import type { UserProfile } from '@vysion/shared';

export class UserService {
  /**
   * Create a new user
   */
  async createUser(data: {
    userId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    userType?: string;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { userId: data.userId },
    });

    if (existingUser) {
      throw new AppError(
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.ALREADY_EXISTS,
        'User already exists'
      );
    }

    const user = await prisma.user.create({
      data: {
        userId: data.userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: data.firstName && data.lastName 
          ? `${data.firstName} ${data.lastName}` 
          : undefined,
        userType: data.userType as any || undefined,
        registrationStatus: 'INCOMPLETE',
      },
      include: {
        physicalAttributes: true,
        footballProfile: true,
      },
    });

    return user;
  }

  /**
   * Get user by userId (Firebase UID)
   */
  async getUserByUserId(userId: string) {
    const user = await prisma.user.findUnique({
      where: { userId },
      include: {
        physicalAttributes: true,
        footballProfile: {
          include: {
            achievements: true,
          },
        },
        availability: true,
        socialLinks: true,
        privacySettings: true,
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
  }

  /**
   * Get user by internal ID
   */
  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        physicalAttributes: true,
        footballProfile: {
          include: {
            achievements: true,
          },
        },
        media: true,
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
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: Partial<UserProfile>) {
    const user = await prisma.user.update({
      where: { userId },
      data: {
        ...data,
        fullName:
          data.firstName && data.lastName
            ? `${data.firstName} ${data.lastName}`
            : undefined,
      },
      include: {
        physicalAttributes: true,
        footballProfile: true,
      },
    });

    return user;
  }

  /**
   * Update or create physical attributes
   */
  async updatePhysicalAttributes(
    userId: string,
    data: {
      height?: number;
      weight?: number;
      wingspan?: number;
      fitnessLevel?: number;
      preferredFoot?: string;
    }
  ) {
    const attributes = await prisma.physicalAttributes.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });

    return attributes;
  }

  /**
   * Update or create football profile
   */
  async updateFootballProfile(
    userId: string,
    data: {
      primaryPosition?: string;
      secondaryPositions?: string[];
      currentClub?: string;
      previousClubs?: string[];
      playingStyle?: string[];
      strongFoot?: string;
      experience?: string;
    }
  ) {
    const profile = await prisma.footballProfile.upsert({
      where: { userId },
      update: data as any,
      create: {
        userId,
        ...data,
      } as any,
      include: {
        achievements: true,
      },
    });

    return profile;
  }

  /**
   * Delete user (soft delete by updating status)
   */
  async deleteUser(userId: string) {
    await prisma.user.update({
      where: { userId },
      data: {
        registrationStatus: 'INCOMPLETE',
        // Add other soft delete fields as needed
      },
    });

    return { message: 'User deleted successfully' };
  }
}

export const userService = new UserService();
