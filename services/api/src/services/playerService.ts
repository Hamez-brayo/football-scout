import { prisma } from '@/config/database';
import { AppError } from '@/middleware/errorHandler';
import {
  ERROR_CODES,
  HTTP_STATUS,
  PAGINATION,
  UserRole,
  type SearchFilters,
} from '@vysion/shared';

export class PlayerService {
  private toBirthDateRange(ageMin?: number, ageMax?: number) {
    if (!ageMin && !ageMax) {
      return undefined;
    }

    const now = new Date();
    const range: { gte?: Date; lte?: Date } = {};

    if (ageMax) {
      range.gte = new Date(now.getFullYear() - ageMax, now.getMonth(), now.getDate());
    }

    if (ageMin) {
      range.lte = new Date(now.getFullYear() - ageMin, now.getMonth(), now.getDate());
    }

    return range;
  }

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

    const dateOfBirth = this.toBirthDateRange(ageMin, ageMax);

    const where: any = {
      role: UserRole.PLAYER,
      registrationStatus: 'COMPLETE',
      ...(nationality ? { nationality: { equals: nationality, mode: 'insensitive' } } : {}),
      ...(dateOfBirth ? { dateOfBirth } : {}),
      ...(query
        ? {
            OR: [
              { firstName: { contains: query, mode: 'insensitive' } },
              { lastName: { contains: query, mode: 'insensitive' } },
              { fullName: { contains: query, mode: 'insensitive' } },
            ],
          }
        : {}),
      playerProfile: {
        is: {
          ...(position ? { primaryPosition: { equals: position, mode: 'insensitive' } } : {}),
          ...(currentClub ? { currentClub: { contains: currentClub, mode: 'insensitive' } } : {}),
          ...(experienceLevel ? { experienceLevel } : {}),
          ...(heightMin || heightMax
            ? {
                physicalAttributes: {
                  is: {
                    ...(heightMin ? { heightCm: { gte: heightMin } } : {}),
                    ...(heightMax ? { heightCm: { lte: heightMax } } : {}),
                  },
                },
              }
            : {}),
        },
      },
    };

    const players = await prisma.user.findMany({
      where,
      skip,
      take,
      include: {
        playerProfile: {
          include: {
            physicalAttributes: true,
            footballProfile: {
              include: {
                achievements: true,
              },
            },
          },
        },
        playerStats: {
          include: {
            metricType: true,
          },
          orderBy: { recordedAt: 'desc' },
        },
        media: {
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const filteredBySpeed = players.filter((player: any) => {
      if (speedMin === undefined && speedMax === undefined) {
        return true;
      }

      const latestSpeed = (player.playerStats as any[]).find(
        (stat: any) => stat.metricType.key === 'speed'
      );
      if (!latestSpeed) {
        return false;
      }

      if (speedMin !== undefined && latestSpeed.value < speedMin) {
        return false;
      }

      if (speedMax !== undefined && latestSpeed.value > speedMax) {
        return false;
      }

      return true;
    });

    const total = await prisma.user.count({ where });

    return {
      items: filteredBySpeed,
      total,
      page,
      limit: take,
      hasMore: skip + take < total,
    };
  }

  async getPlayerById(id: string) {
    const player = await prisma.user.findFirst({
      where: {
        role: UserRole.PLAYER,
        OR: [{ id }, { userId: id }],
      },
      include: {
        playerProfile: {
          include: {
            physicalAttributes: true,
            footballProfile: {
              include: {
                achievements: true,
              },
            },
          },
        },
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

  async getPlayerStats(playerId: string) {
    const player = await this.getPlayerById(playerId);

    const stats = await prisma.playerStat.findMany({
      where: { playerId: player.userId },
      include: {
        metricType: true,
      },
      orderBy: { recordedAt: 'asc' },
    });

    const grouped = stats.reduce((acc: Record<string, any[]>, stat: any) => {
      const key = stat.metricType.key;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(stat);
      return acc;
    }, {});

    const summary = (Object.entries(grouped) as [string, any[]][]).map(([metricKey, entries]) => {
      const latest = entries[entries.length - 1];
      const previous = entries.length > 1 ? entries[entries.length - 2] : null;

      return {
        metricKey,
        metricName: latest.metricType.displayName,
        latestValue: latest.value,
        previousValue: previous?.value ?? null,
        delta: previous ? latest.value - previous.value : null,
        samples: entries.length,
        unit: latest.metricType.unit,
      };
    });

    return {
      playerId: player.userId,
      summary,
      timeline: stats,
    };
  }

  async createPlayerProfile(userId: string, profileData: any) {
    return this.upsertPlayerProfile(userId, profileData);
  }

  async getPlayerProfile(userId: string) {
    const player = await prisma.user.findUnique({
      where: { userId },
      include: {
        playerProfile: {
          include: {
            physicalAttributes: true,
            footballProfile: {
              include: {
                achievements: true,
              },
            },
          },
        },
        media: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!player) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
        'User not found'
      );
    }

    if (player.role !== UserRole.PLAYER) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        'Only PLAYER accounts can access player profile data'
      );
    }

    return player;
  }

  async updatePlayerProfile(userId: string, profileData: any) {
    return this.upsertPlayerProfile(userId, profileData);
  }

  private async upsertPlayerProfile(userId: string, profileData: any) {
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

    if (user.role !== UserRole.PLAYER) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        'Only PLAYER accounts can create or update player profile'
      );
    }

    await prisma.playerProfile.upsert({
      where: { userId },
      create: {
        userId,
        primaryPosition: profileData.primaryPosition,
        secondaryPositions: profileData.secondaryPositions ?? [],
        currentClub: profileData.currentClub,
        preferredFoot: profileData.preferredFoot,
        experienceLevel: profileData.experienceLevel,
        isAvailable: profileData.isAvailable ?? true,
        bio: profileData.bio,
      },
      update: {
        primaryPosition: profileData.primaryPosition,
        secondaryPositions: profileData.secondaryPositions,
        currentClub: profileData.currentClub,
        preferredFoot: profileData.preferredFoot,
        experienceLevel: profileData.experienceLevel,
        isAvailable: profileData.isAvailable,
        bio: profileData.bio,
      },
    });

    const profile = await prisma.playerProfile.findUniqueOrThrow({
      where: { userId },
    });

    if (profileData.physicalAttributes) {
      await prisma.physicalAttributes.upsert({
        where: { playerProfileId: profile.id },
        create: {
          playerProfileId: profile.id,
          ...profileData.physicalAttributes,
        },
        update: {
          ...profileData.physicalAttributes,
        },
      });
    }

    if (profileData.footballProfile) {
      await prisma.footballProfile.upsert({
        where: { playerProfileId: profile.id },
        create: {
          playerProfileId: profile.id,
          ...profileData.footballProfile,
        },
        update: {
          ...profileData.footballProfile,
        },
      });
    }

    return this.getPlayerProfile(userId);
  }
}

export const playerService = new PlayerService();
