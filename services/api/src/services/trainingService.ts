import { prisma } from '@/config/database';
import { AppError } from '@/middleware/errorHandler';
import { ERROR_CODES, HTTP_STATUS } from '@vysion/shared';

export class TrainingService {
  async listPrograms() {
    return prisma.trainingProgram.findMany({
      include: {
        drills: {
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createProgram(
    scoutId: string,
    data: {
      title: string;
      level: string;
      positionFocus: string;
      description?: string;
    }
  ) {
    return prisma.trainingProgram.create({
      data: {
        ...data,
        createdById: scoutId,
      },
      include: {
        drills: true,
      },
    });
  }

  async listDrills(trainingProgramId?: string) {
    return prisma.drill.findMany({
      where: trainingProgramId ? { trainingProgramId } : undefined,
      include: {
        trainingProgram: true,
      },
      orderBy: [{ trainingProgramId: 'asc' }, { displayOrder: 'asc' }],
    });
  }

  async createDrill(data: {
    trainingProgramId: string;
    title: string;
    type: 'TECHNICAL' | 'ATHLETIC';
    instructions: string;
    videoUrl?: string;
    displayOrder?: number;
  }) {
    const program = await prisma.trainingProgram.findUnique({
      where: { id: data.trainingProgramId },
    });

    if (!program) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
        'Training program not found'
      );
    }

    return prisma.drill.create({
      data: {
        ...data,
        displayOrder: data.displayOrder ?? 0,
      },
      include: {
        trainingProgram: true,
      },
    });
  }

  async submitDrill(
    playerId: string,
    data: {
      drillId: string;
      videoUrl: string;
    }
  ) {
    const drill = await prisma.drill.findUnique({ where: { id: data.drillId } });
    if (!drill) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
        'Drill not found'
      );
    }

    return prisma.drillSubmission.create({
      data: {
        playerId,
        drillId: data.drillId,
        videoUrl: data.videoUrl,
        status: 'PENDING',
      },
      include: {
        drill: true,
      },
    });
  }
}

export const trainingService = new TrainingService();
