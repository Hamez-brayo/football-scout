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
    const [players, total] = await Promise.all([
      prisma.user.findMany({
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
      }),
      prisma.user.count({ where }),
    ]);

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
}

export const playerService = new PlayerService();
