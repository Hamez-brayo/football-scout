import { prisma } from '@/config/database';
import { AppError } from '@/middleware/errorHandler';
import { ERROR_CODES, HTTP_STATUS, type SearchFilters } from '@vysion/shared';
import { playerService } from './playerService';

export class ScoutService {
  async searchPlayers(filters: SearchFilters) {
    return playerService.searchPlayers(filters);
  }

  async addShortlistEntry(scoutId: string, data: { playerId: string; notes?: string }) {
    const player = await prisma.user.findUnique({ where: { userId: data.playerId } });
    if (!player) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'Player not found');
    }

    return prisma.shortlist.upsert({
      where: {
        scoutId_playerId: {
          scoutId,
          playerId: data.playerId,
        },
      },
      update: {
        notes: data.notes,
      },
      create: {
        scoutId,
        playerId: data.playerId,
        notes: data.notes,
      },
    });
  }

  async removeShortlistEntry(scoutId: string, playerId: string) {
    const existing = await prisma.shortlist.findUnique({
      where: {
        scoutId_playerId: {
          scoutId,
          playerId,
        },
      },
    });

    if (!existing) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
        'Shortlist entry not found'
      );
    }

    await prisma.shortlist.delete({
      where: {
        scoutId_playerId: {
          scoutId,
          playerId,
        },
      },
    });

    return { deleted: true };
  }

  async recordPlayerView(scoutId: string, playerId: string) {
    return prisma.playerView.create({
      data: {
        scoutId,
        playerId,
      },
    });
  }
}

export const scoutService = new ScoutService();
