import { prisma } from '@/config/database';
import { AppError } from '@/middleware/errorHandler';
import { HTTP_STATUS, ERROR_CODES, PAGINATION } from '@vysion/shared';
import type { SearchFilters } from '@vysion/shared';

export class PlayerService {
  /**
   * Search players with filters
   */
  async searchPlayers(filters: SearchFilters) {
    const {
      query,
      position,
      nationality,
      ageMin,
      ageMax,
      heightMin,
      heightMax,
      speedMin,
      speedMax,
      experienceLevel,
      currentClub,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = filters;

    const skip = (page - 1) * limit;
    const take = Math.min(limit, PAGINATION.MAX_LIMIT);

    // Build where clause
    const where: any = {
      userType: 'TALENT',
      registrationStatus: 'COMPLETE',
    };

    if (query) {
      where.OR = [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { fullName: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (position) {
      where.position = position;
    }

    if (nationality) {
      where.nationality = nationality;
    }

    if (currentClub) {
      where.currentClub = { contains: currentClub, mode: 'insensitive' };
    }

    if (experienceLevel) {
      where.experienceLevel = experienceLevel;
    }

    if (ageMin || ageMax) {
      const today = new Date();
      if (ageMax) {
        const minDate = new Date(today.getFullYear() - ageMax, today.getMonth(), today.getDate());
        where.dateOfBirth = { ...where.dateOfBirth, gte: minDate.toISOString() };
      }
      if (ageMin) {
        const maxDate = new Date(today.getFullYear() - ageMin, today.getMonth(), today.getDate());
        where.dateOfBirth = { ...where.dateOfBirth, lte: maxDate.toISOString() };
      }
    }

    // Execute query
    let players = await prisma.user.findMany({
      where,
      skip,
      take,
      include: {
        physicalAttributes: true,
        footballProfile: {
          include: {
            achievements: true,
          },
        },
        media: {
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filter by height range (client-side since it's in a relation)
    if (heightMin || heightMax) {
      players = players.filter((p: any) => {
        const height = p.physicalAttributes?.height;
        if (!height) return false;
        if (heightMin && height < heightMin) return false;
        if (heightMax && height > heightMax) return false;
        return true;
      });
    }

    // Filter by speed range (placeholder for actual speed data)
    // Note: speed and stamina are not yet stored in the database
    // This is prepared for future implementation
    if (speedMin || speedMax) {
      // Placeholder - would filter based on stored speed data
      // Currently returning all results
    }

    const total = await prisma.user.count({ where });

    return {
      items: players,
      total,
      page,
      limit: take,
      hasMore: skip + take < total,
    };
  }

  /**
   * Get player by ID (public view)
   */
  async getPlayerById(id: string) {
    const player = await prisma.user.findFirst({
      where: {
        id,
        userType: 'TALENT',
      },
      include: {
        physicalAttributes: true,
        footballProfile: {
          include: {
            achievements: true,
          },
        },
        availability: true,
        socialLinks: true,
        media: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!player) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
        'Player not found'
      );
    }

    return player;
  }

  /**
   * Get player statistics
   */
  async getPlayerStats(playerId: string) {
    const player = await this.getPlayerById(playerId);

    // TODO: Implement actual stats calculation
    // This is a placeholder for future AI-based stat analysis

    return {
      playerId: player.id,
      profileCompleteness: this.calculateProfileCompleteness(player),
      mediaCount: player.media?.length || 0,
      achievementsCount: player.footballProfile?.achievements?.length || 0,
      // Add more stats as needed
    };
  }

  /**
   * Calculate profile completeness percentage
   */
  private calculateProfileCompleteness(player: any): number {
    const requiredFields = [
      'firstName',
      'lastName',
      'dateOfBirth',
      'nationality',
      'currentLocation',
      'profilePhoto',
      'position',
      'currentClub',
    ];

    const profileFields = [
      'physicalAttributes.height',
      'physicalAttributes.weight',
      'footballProfile.primaryPosition',
      'footballProfile.experience',
    ];

    let filledFields = 0;
    const totalFields = requiredFields.length + profileFields.length;

    requiredFields.forEach((field) => {
      if (player[field]) filledFields++;
    });

    profileFields.forEach((field) => {
      const [obj, prop] = field.split('.');
      if (player[obj]?.[prop]) filledFields++;
    });

    return Math.round((filledFields / totalFields) * 100);
  }

  /**
   * Create player profile for current user
   */
  async createPlayerProfile(userId: string, profileData: any) {
    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
        'User not found'
      );
    }

    if (user.userType !== 'TALENT') {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        'Only talent users can create player profiles'
      );
    }

    // Update user with profile data
    const updatedUser = await prisma.user.update({
      where: { userId },
      data: {
        fullName: profileData.fullName || `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim(),
        position: profileData.position,
        currentClub: profileData.currentClub,
        preferredFoot: profileData.preferredFoot,
        profilePhoto: profileData.profilePhoto,
      },
      include: {
        physicalAttributes: true,
        footballProfile: true,
      },
    });

    // Create or update physical attributes
    if (profileData.height || profileData.weight || profileData.speed || profileData.stamina) {
      await prisma.physicalAttributes.upsert({
        where: { userId },
        create: {
          userId,
          height: profileData.height,
          weight: profileData.weight,
          preferredFoot: profileData.preferredFoot,
        },
        update: {
          height: profileData.height,
          weight: profileData.weight,
          preferredFoot: profileData.preferredFoot,
        },
      });
    }

    // Create or update football profile
    if (profileData.position || profileData.currentClub) {
      await prisma.footballProfile.upsert({
        where: { userId },
        create: {
          userId,
          primaryPosition: profileData.position,
          currentClub: profileData.currentClub,
        },
        update: {
          primaryPosition: profileData.position,
          currentClub: profileData.currentClub,
        },
      });
    }

    return this.getPlayerById(user.id);
  }

  /**
   * Get player profile for current user
   */
  async getPlayerProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { userId },
      include: {
        physicalAttributes: true,
        footballProfile: {
          include: {
            achievements: true,
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

    if (user.userType !== 'TALENT') {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        'Only talent users can access player profiles'
      );
    }

    return user;
  }

  /**
   * Update player profile for current user
   */
  async updatePlayerProfile(userId: string, profileData: any) {
    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
        'User not found'
      );
    }

    if (user.userType !== 'TALENT') {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        'Only talent users can update player profiles'
      );
    }

    // Update user with profile data
    const updatedUser = await prisma.user.update({
      where: { userId },
      data: {
        fullName: profileData.fullName,
        position: profileData.position,
        currentClub: profileData.currentClub,
        preferredFoot: profileData.preferredFoot,
        profilePhoto: profileData.profilePhoto,
      },
      include: {
        physicalAttributes: true,
        footballProfile: true,
      },
    });

    // Update physical attributes if provided
    if (profileData.height !== undefined || profileData.weight !== undefined) {
      await prisma.physicalAttributes.upsert({
        where: { userId },
        create: {
          userId,
          height: profileData.height,
          weight: profileData.weight,
          preferredFoot: profileData.preferredFoot,
        },
        update: {
          height: profileData.height,
          weight: profileData.weight,
          preferredFoot: profileData.preferredFoot,
        },
      });
    }

    // Update football profile if provided
    if (profileData.position !== undefined || profileData.currentClub !== undefined) {
      await prisma.footballProfile.upsert({
        where: { userId },
        create: {
          userId,
          primaryPosition: profileData.position,
          currentClub: profileData.currentClub,
        },
        update: {
          primaryPosition: profileData.position,
          currentClub: profileData.currentClub,
        },
      });
    }

    return this.getPlayerById(user.id);
  }
}

export const playerService = new PlayerService();
