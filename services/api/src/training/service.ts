import { z } from 'zod';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

const httpsUrl = z.string().url().max(2048).refine((value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}, 'Use an HTTPS link without embedded credentials');

export const attemptInputSchema = z.object({
  drillId: z.string().trim().min(1).max(100),
  videoUrl: httpsUrl.optional(),
  notes: z.string().trim().max(2000).optional(),
  resultValue: z.number().finite().min(0).max(1000000).optional(),
  resultUnit: z.string().trim().min(1).max(40).optional(),
}).strict().refine(
  (value) => (value.resultValue === undefined) === (value.resultUnit === undefined),
  'Provide both measurement and unit',
);
export type AttemptInput = z.infer<typeof attemptInputSchema>;

type Attempt = {
  id: string;
  drillId: string;
  videoUrl: string | null;
  notes: string | null;
  resultValue: number | null;
  resultUnit: string | null;
  isPublic: boolean;
  createdAt: Date;
};
type Privacy = { profileVisibility: string; mediaVisibility: string };
type TrainingDB = {
  trainingAttempt: {
    create(args: unknown): Promise<Attempt>;
    findMany(args: unknown): Promise<Attempt[]>;
    updateMany(args: unknown): Promise<{ count: number }>;
    findFirst(args: unknown): Promise<Attempt | null>;
  };
  user: {
    findUnique(args: unknown): Promise<{ id: string; privacySettings: Privacy | null } | null>;
  };
};

const select = {
  id: true, drillId: true, videoUrl: true, notes: true,
  resultValue: true, resultUnit: true, isPublic: true, createdAt: true,
};
const missing = () => new AppError(404, 'NOT_FOUND', 'Resource not found');

export class TrainingService {
  private readonly db: TrainingDB;

  constructor(db: unknown = prisma) {
    this.db = db as TrainingDB;
  }

  list(ownerId: string): Promise<Attempt[]> {
    return this.db.trainingAttempt.findMany({
      where: { ownerId }, select, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: 100,
    });
  }

  create(ownerId: string, input: AttemptInput): Promise<Attempt> {
    return this.db.trainingAttempt.create({ data: { ...input, ownerId, isPublic: false }, select });
  }

  async setVisibility(id: string, ownerId: string, isPublic: boolean): Promise<Attempt> {
    const result = await this.db.trainingAttempt.updateMany({
      where: { id, ownerId }, data: { isPublic },
    });
    if (!result.count) throw missing();
    const attempt = await this.db.trainingAttempt.findFirst({ where: { id, ownerId }, select });
    if (!attempt) throw missing();
    return attempt;
  }

  async evidence(ownerId: string, actor: string): Promise<Attempt[]> {
    const owner = await this.db.user.findUnique({
      where: { id: ownerId },
      select: { id: true, privacySettings: { select: { profileVisibility: true, mediaVisibility: true } } },
    });
    if (!owner || (actor !== ownerId && owner.privacySettings && (
      owner.privacySettings.profileVisibility !== 'public' ||
      owner.privacySettings.mediaVisibility !== 'public'
    ))) throw missing();
    const rows = await this.db.trainingAttempt.findMany({
      where: {
        ownerId,
        isPublic: true,
        ...(actor === ownerId ? {} : { owner: { OR: [
          { privacySettings: null },
          { privacySettings: { profileVisibility: 'public', mediaVisibility: 'public' } },
        ] } }),
      },
      select: { ...select, notes: false },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: 100,
    });
    return rows.map((row) => ({
      id: row.id,
      drillId: row.drillId,
      videoUrl: row.videoUrl,
      notes: null,
      resultValue: row.resultValue,
      resultUnit: row.resultUnit,
      isPublic: row.isPublic,
      createdAt: row.createdAt,
    }));
  }
}

export const trainingService = new TrainingService();
