import { afterAll, beforeAll, describe, expect, jest, test } from '@jest/globals';
import express, { NextFunction, Request, Response } from 'express';
import { Server } from 'http';

jest.mock('../src/middleware/auth', () => ({
  authenticate: (req: Request & { user?: { id: string } }, res: Response, next: NextFunction) => {
    if (!['Bearer valid', 'Bearer attacker'].includes(req.headers.authorization ?? '')) {
      res.status(401).json({ success: false });
      return;
    }
    req.user = { id: req.headers.authorization === 'Bearer attacker' ? 'attacker' : 'authenticated-actor' };
    next();
  },
}));
const getPreference = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const setPreference = jest.fn<(...args: unknown[]) => Promise<unknown>>();
jest.mock('../src/network/service', () => ({
  networkService: {
    playerSearchPreference: getPreference,
    setPlayerSearchPreference: setPreference,
  },
}));
const router = (require('../src/network/routes') as typeof import('../src/network/routes')).default;
const { errorHandler } = require('../src/middleware/errorHandler') as typeof import('../src/middleware/errorHandler');
let server: Server;
let base: string;
const headers = { Authorization: 'Bearer valid', 'Content-Type': 'application/json' };

beforeAll(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/network', router);
  app.use(errorHandler);
  server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Expected local test listener');
  base = `http://127.0.0.1:${address.port}/api/network/me/player-search`;
});
afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

describe('player search preference endpoints', () => {
  test('reject unauthenticated reads and writes', async () => {
    expect((await fetch(base)).status).toBe(401);
    expect((await fetch(base, { method: 'PATCH' })).status).toBe(401);
    expect(getPreference).not.toHaveBeenCalled();
    expect(setPreference).not.toHaveBeenCalled();
  });

  test('reject malformed values and attempts to choose another owner', async () => {
    for (const body of [{ enabled: 'true' }, { enabled: true, ownerId: 'victim' }]) {
      expect((await fetch(base, { method: 'PATCH', headers, body: JSON.stringify(body) })).status).toBe(400);
    }
    expect(setPreference).not.toHaveBeenCalled();
  });

  test('read and write the authenticated actor preference', async () => {
    getPreference.mockResolvedValue({ enabled: false });
    setPreference.mockResolvedValue({ enabled: true });
    const read = await fetch(base, { headers });
    expect(read.status).toBe(200);
    expect(await read.json()).toMatchObject({ success: true, data: { enabled: false } });
    expect(getPreference).toHaveBeenCalledWith('authenticated-actor');
    const write = await fetch(base, { method: 'PATCH', headers, body: JSON.stringify({ enabled: true }) });
    expect(write.status).toBe(200);
    expect(await write.json()).toMatchObject({ success: true, data: { enabled: true } });
    expect(setPreference).toHaveBeenCalledWith('authenticated-actor', true);
  });

  test('another account cannot select a victim as the owner', async () => {
    const attackerHeaders = { Authorization: 'Bearer attacker', 'Content-Type': 'application/json' };
    const forged = await fetch(base, {
      method: 'PATCH', headers: attackerHeaders,
      body: JSON.stringify({ enabled: true, ownerId: 'authenticated-actor' }),
    });
    expect(forged.status).toBe(400);
    setPreference.mockClear();
    setPreference.mockResolvedValue({ enabled: true });
    const own = await fetch(base, {
      method: 'PATCH', headers: attackerHeaders, body: JSON.stringify({ enabled: true }),
    });
    expect(own.status).toBe(200);
    expect(setPreference).toHaveBeenCalledWith('attacker', true);
  });
});
