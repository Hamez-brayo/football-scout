import { prisma } from '@/config/database';
import { AppError } from '@/middleware/errorHandler';
import {
  ERROR_CODES,
  HTTP_STATUS,
  UserRole,
  type UserProfile,
} from '@vysion/shared';

export class UserService {
  async createUser(data: {
    userId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: UserRole;
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
        fullName:
          data.firstName && data.lastName
            ? `${data.firstName} ${data.lastName}`
            : undefined,
        role: data.role ?? UserRole.PLAYER,
        registrationStatus: 'INCOMPLETE',
      },
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

    return user;
  }

  async getUserByUserId(userId: string) {
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
  }

  async getUserById(id: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
      },
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
  }

  async updateProfile(userId: string, data: Partial<UserProfile>) {
    const user = await prisma.user.update({
      where: { userId },
      data: {
        ...(data as any),
        fullName:
          data.firstName && data.lastName
            ? `${data.firstName} ${data.lastName}`
            : data.fullName,
      },
      include: {
        playerProfile: {
          include: {
            physicalAttributes: true,
            footballProfile: true,
          },
        },
      },
    });

    return user;
  }

  private async getOrCreatePlayerProfile(userId: string) {
    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
        'User not found'
      );
    }

    if (user.role !== UserRole.PLAYER) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        'Only PLAYER accounts can modify player profile sections'
      );
    }

    const profile = await prisma.playerProfile.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    return profile;
  }

  async updatePhysicalAttributes(
    userId: string,
    data: {
      heightCm?: number;
      weightKg?: number;
      wingspanCm?: number;
      sprintSpeed?: number;
      staminaScore?: number;
    }
  ) {
    const profile = await this.getOrCreatePlayerProfile(userId);

    const attributes = await prisma.physicalAttributes.upsert({
      where: { playerProfileId: profile.id },
      update: data,
      create: {
        playerProfileId: profile.id,
        ...data,
      },
    });

    return attributes;
  }

  async updateFootballProfile(
    userId: string,
    data: {
      dominantFoot?: 'LEFT' | 'RIGHT' | 'BOTH';
      playingStyle?: string[];
      strongestSkills?: string[];
      weakFootRating?: number;
    }
  ) {
    const profile = await this.getOrCreatePlayerProfile(userId);

    const footballProfile = await prisma.footballProfile.upsert({
      where: { playerProfileId: profile.id },
      update: data,
      create: {
        playerProfileId: profile.id,
        ...data,
      },
      include: {
        achievements: true,
      },
    });

    return footballProfile;
  }

  async deleteUser(userId: string) {
    await prisma.user.update({
      where: { userId },
      data: {
        registrationStatus: 'INCOMPLETE',
      },
    });

    return { message: 'User deleted successfully' };
  }
}

export const userService = new UserService();
