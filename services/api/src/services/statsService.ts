import { prisma } from '@/config/database';
import { AppError } from '@/middleware/errorHandler';
import { ERROR_CODES, HTTP_STATUS } from '@vysion/shared';

export class StatsService {
  async getPlayerStatsHistory(
    playerId: string,
    query: { metricKey?: string; from?: string; to?: string }
  ) {
    const where: any = {
      playerId,
    };

    if (query.metricKey) {
      where.metricType = {
        key: query.metricKey,
      };
    }

    if (query.from || query.to) {
      where.recordedAt = {
        ...(query.from ? { gte: new Date(query.from) } : {}),
        ...(query.to ? { lte: new Date(query.to) } : {}),
      };
    }

    const stats = await prisma.playerStat.findMany({
      where,
      include: {
        metricType: true,
      },
      orderBy: { recordedAt: 'asc' },
    });

    return {
      playerId,
      entries: stats,
    };
  }

  async createStatEntry(payload: {
    playerId: string;
    metricKey: string;
    value: number;
    recordedAt?: string;
    source?: string;
  }) {
    const player = await prisma.user.findUnique({ where: { userId: payload.playerId } });
    if (!player) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'Player not found');
    }

    const metric = await prisma.metricType.upsert({
      where: { key: payload.metricKey },
      update: {
        displayName: payload.metricKey,
      },
      create: {
        key: payload.metricKey,
        displayName: payload.metricKey,
      },
    });

    const stat = await prisma.playerStat.create({
      data: {
        playerId: payload.playerId,
        metricTypeId: metric.id,
        value: payload.value,
        recordedAt: payload.recordedAt ? new Date(payload.recordedAt) : new Date(),
        source: payload.source,
      },
      include: {
        metricType: true,
      },
    });

    return stat;
  }
}

export const statsService = new StatsService();
