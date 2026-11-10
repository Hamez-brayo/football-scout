import { afterAll, beforeAll, describe, expect, jest, test } from '@jest/globals';
import { randomUUID } from 'crypto';

// This suite creates and deletes only its own records in an explicitly named local test DB.
// It is never enabled by the application's regular DATABASE_URL.
const testDatabaseUrl = process.env.VYSION_TRAINING_TEST_DATABASE_URL;
const integration = testDatabaseUrl ? describe : describe.skip;
jest.mock('../src/config/database', () => ({ prisma: {} }));

integration('training persistence on a disposable local database', () => {
  let client: import('@prisma/client').PrismaClient;
  let service: import('../src/training/service').TrainingService;
  const suffix = randomUUID();
  const ownerExternalId = `training-owner-${suffix}`;
  const scoutExternalId = `training-scout-${suffix}`;
  let ownerId = '';
  let scoutId = '';

  beforeAll(async () => {
    const url = new URL(testDatabaseUrl!);
    const database = url.pathname.slice(1);
    if (url.hostname !== '127.0.0.1' || Number(url.port) < 1024 || !database.startsWith('vysion_test_')) {
      throw new Error('Integration tests require an explicitly named disposable loopback database');
    }
    const { PrismaClient } = require('@prisma/client') as typeof import('@prisma/client');
    const { TrainingService } = require('../src/training/service') as typeof import('../src/training/service');
    client = new PrismaClient({ datasources: { db: { url: testDatabaseUrl } } });
    service = new TrainingService(client);
    const owner = await client.user.create({
      data: {
        userId: ownerExternalId,
        email: `${ownerExternalId}@example.invalid`,
        privacySettings: { create: { profileVisibility: 'public', mediaVisibility: 'public' } },
      },
    });
    ownerId = owner.id;
    const scout = await client.user.create({
      data: { userId: scoutExternalId, email: `${scoutExternalId}@example.invalid` },
    });
    scoutId = scout.id;
  });

  afterAll(async () => {
    if (!client) return;
    await client.privacySettings.deleteMany({ where: { userId: { in: [ownerExternalId, scoutExternalId] } } });
    await client.user.deleteMany({ where: { userId: { in: [ownerExternalId, scoutExternalId] } } });
    await client.$disconnect();
  });

  test('private, shared, profile-hidden and revoked evidence persist and enforce access', async () => {
    const attempt = await service.create(ownerId, {
      drillId: 'integration-drill',
      videoUrl: 'https://example.invalid/footage',
      notes: 'private note',
      resultValue: 8,
      resultUnit: 'repetitions',
    });
    expect(attempt.isPublic).toBe(false);
    expect((await service.list(ownerId)).map((item) => item.id)).toContain(attempt.id);
    expect(await service.evidence(ownerId, scoutId)).toEqual([]);
    await expect(service.setVisibility(attempt.id, scoutId, true)).rejects.toMatchObject({ statusCode: 404 });

    await service.setVisibility(attempt.id, ownerId, true);
    const shared = await service.evidence(ownerId, scoutId);
    expect(shared).toHaveLength(1);
    expect(shared[0]).toMatchObject({ id: attempt.id, notes: null, resultValue: 8 });
    expect(shared[0]).not.toHaveProperty('ownerId');

    await client.privacySettings.update({ where: { userId: ownerExternalId }, data: { mediaVisibility: 'private' } });
    await expect(service.evidence(ownerId, scoutId)).rejects.toMatchObject({ statusCode: 404 });
    await client.privacySettings.update({ where: { userId: ownerExternalId }, data: { mediaVisibility: 'public' } });
    await service.setVisibility(attempt.id, ownerId, false);
    expect(await service.evidence(ownerId, scoutId)).toEqual([]);
  });
});
