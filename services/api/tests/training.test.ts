import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { PrismaClient } from '@prisma/client';

jest.mock('../src/config/database', () => ({ prisma: {} }));
const { TrainingService, attemptInputSchema } = require('../src/training/service') as typeof import('../src/training/service');

const create = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const findMany = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const updateMany = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const findFirst = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const findUnique = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const db = {
  trainingAttempt: { create, findMany, updateMany, findFirst },
  user: { findUnique },
} as unknown as PrismaClient;
const service = new TrainingService(db);
beforeEach(() => jest.resetAllMocks());

describe('training evidence privacy', () => {
  test('creates private records for the authenticated owner and rejects spoofing', async () => {
    expect(attemptInputSchema.safeParse({ drillId: 'touch', ownerId: 'other' }).success).toBe(false);
    create.mockResolvedValue({ id: '1', isPublic: false });
    await service.create('owner', attemptInputSchema.parse({ drillId: 'touch' }));
    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ ownerId: 'owner', isPublic: false }),
    }));
  });
  test('requires HTTPS video URLs without embedded credentials', () => {
    for (const videoUrl of ['http://example.com/v', 'javascript:alert(1)', 'https://x:y@example.com/v']) {
      expect(attemptInputSchema.safeParse({ drillId: 'touch', videoUrl }).success).toBe(false);
    }
    expect(attemptInputSchema.safeParse({ drillId: 'touch', videoUrl: 'https://example.com/v' }).success).toBe(true);
  });
  test('self-reported measurement needs both number and unit', () => {
    expect(attemptInputSchema.safeParse({ drillId: 'touch', resultValue: 1 }).success).toBe(false);
    expect(attemptInputSchema.safeParse({ drillId: 'touch', resultUnit: 'reps' }).success).toBe(false);
    expect(attemptInputSchema.safeParse({ drillId: 'touch', resultValue: 1, resultUnit: 'reps' }).success).toBe(true);
  });
  test('owners only list their own attempts', async () => {
    findMany.mockResolvedValue([]);
    await service.list('owner');
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { ownerId: 'owner' } }));
  });
  test('another account cannot change a private attempt visibility', async () => {
    updateMany.mockResolvedValue({ count: 0 });
    await expect(service.setVisibility('attempt', 'other', true)).rejects.toMatchObject({ statusCode: 404 });
    expect(updateMany).toHaveBeenCalledWith({ where: { id: 'attempt', ownerId: 'other' }, data: { isPublic: true } });
  });
  test('private profile or private media prevents even explicitly shared evidence', async () => {
    for (const settings of [
      { profileVisibility: 'private', mediaVisibility: 'public' },
      { profileVisibility: 'public', mediaVisibility: 'private' },
    ]) {
      findUnique.mockResolvedValue({ id: 'owner', privacySettings: settings });
      await expect(service.evidence('owner', 'scout')).rejects.toMatchObject({ statusCode: 404 });
      expect(findMany).not.toHaveBeenCalled();
    }
  });
  test('scout receives only explicit public evidence and no private notes', async () => {
    findUnique.mockResolvedValue({ id: 'owner', privacySettings: { profileVisibility: 'public', mediaVisibility: 'public' } });
    findMany.mockResolvedValue([{ id: '1', drillId: 'touch', notes: 'secret', ownerId: 'private-id', isPublic: true }]);
    const result = await service.evidence('owner', 'scout');
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ where: {
      ownerId: 'owner', isPublic: true,
      owner: { OR: [
        { privacySettings: null },
        { privacySettings: { profileVisibility: 'public', mediaVisibility: 'public' } },
      ] },
    } }));
    expect(result[0]).not.toHaveProperty('notes', 'secret');
    expect(result[0]).not.toHaveProperty('ownerId');
  });
});
