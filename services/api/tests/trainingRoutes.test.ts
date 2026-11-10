import { afterAll, beforeAll, describe, expect, jest, test } from '@jest/globals';
import express, { NextFunction, Request, Response } from 'express';
import { Server } from 'http';

jest.mock('../src/config/database', () => ({ prisma: {} }));
jest.mock('../src/middleware/auth', () => ({
  authenticate: (req: Request & { user?: { id: string } }, res: Response, next: NextFunction) => {
    if (req.headers.authorization !== 'Bearer valid') {
      res.status(401).json({ success: false });
      return;
    }
    req.user = { id: 'actor' };
    next();
  },
}));
const list = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const create = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const setVisibility = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const evidence = jest.fn<(...args: unknown[]) => Promise<unknown>>();
jest.mock('../src/training/service', () => {
  const actual = jest.requireActual<typeof import('../src/training/service')>('../src/training/service');
  return { ...actual, trainingService: { list, create, setVisibility, evidence } };
});
const router = (require('../src/training/routes') as typeof import('../src/training/routes')).default;
const { errorHandler } = require('../src/middleware/errorHandler') as typeof import('../src/middleware/errorHandler');
let server: Server;
let base: string;
const headers = { Authorization: 'Bearer valid', 'Content-Type': 'application/json' };

beforeAll(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/training', router);
  app.use(errorHandler);
  server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Expected local test listener');
  base = `http://127.0.0.1:${address.port}/api/training`;
});
afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

describe('authenticated training routes', () => {
  test('unauthenticated users cannot access any endpoint', async () => {
    for (const path of ['/attempts', '/players/owner/evidence']) {
      expect((await fetch(base + path)).status).toBe(401);
    }
    expect((await fetch(base + '/attempts/1/visibility', { method: 'PATCH' })).status).toBe(401);
  });
  test('rejects owner spoofing and unsafe footage before calling persistence', async () => {
    for (const body of [
      { drillId: 'touch', ownerId: 'other' },
      { drillId: 'touch', videoUrl: 'https://u:p@example.com/v' },
      { drillId: 'touch', isPublic: true },
    ]) {
      const response = await fetch(base + '/attempts', { method: 'POST', headers, body: JSON.stringify(body) });
      expect(response.status).toBe(400);
    }
    expect(create).not.toHaveBeenCalled();
  });
  test('uses session actor for creation, visibility and profile evidence', async () => {
    create.mockResolvedValue({ id: '1', isPublic: false });
    setVisibility.mockResolvedValue({ id: '1', isPublic: true });
    evidence.mockResolvedValue([]);
    const created = await fetch(base + '/attempts', {
      method: 'POST', headers, body: JSON.stringify({ drillId: 'touch' }),
    });
    expect(created.status).toBe(201);
    expect(create).toHaveBeenCalledWith('actor', { drillId: 'touch' });
    const shared = await fetch(base + '/attempts/1/visibility', {
      method: 'PATCH', headers, body: JSON.stringify({ isPublic: true }),
    });
    expect(shared.status).toBe(200);
    expect(setVisibility).toHaveBeenCalledWith('1', 'actor', true);
    expect((await fetch(base + '/players/owner/evidence', { headers })).status).toBe(200);
    expect(evidence).toHaveBeenCalledWith('owner', 'actor');
  });
});
