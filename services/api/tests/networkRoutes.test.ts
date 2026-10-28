import { afterAll, beforeAll, describe, expect, jest, test } from '@jest/globals';
import express, { Request, Response, NextFunction } from 'express';
import { Server } from 'http';

jest.mock('../src/middleware/auth', () => ({
  authenticate: (req: Request & { user?: { id: string } }, res: Response, next: NextFunction) => {
    if (req.headers.authorization !== 'Bearer valid') {
      res.status(401).json({ success: false });
      return;
    }
    req.user = { id: 'authenticated-actor' };
    next();
  },
}));
const profile = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const createOrganisation = jest.fn<(...args: unknown[]) => Promise<unknown>>();
jest.mock('../src/network/service', () => ({
  networkService: {
    profile: (...args: unknown[]) => profile(...args),
    createOrganisation: (...args: unknown[]) => createOrganisation(...args),
  },
}));
import router from '../src/network/routes';
import { errorHandler } from '../src/middleware/errorHandler';
let server: Server;
let base: string;
beforeAll(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/network', router);
  app.use(errorHandler);
  server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Expected test listener');
  base = `http://127.0.0.1:${address.port}/api/network`;
});
afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});
describe('authenticated network routes', () => {
  test('all network namespaces require authentication', async () => {
    for (const path of [
      '/me',
      '/profiles',
      '/organisations',
      '/connections',
      '/posts',
      '/opportunities',
      '/connections/c/messages',
    ]) {
      expect((await fetch(base + path)).status).toBe(401);
    }
    expect(profile).not.toHaveBeenCalled();
  });
  test('own profile uses actor and standard response envelope', async () => {
    profile.mockResolvedValue({ id: 'authenticated-actor', headline: 'Coach' });
    const response = await fetch(base + '/me', {
      headers: { Authorization: 'Bearer valid' },
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      success: true,
      data: { id: 'authenticated-actor' },
    });
    expect(profile).toHaveBeenCalledWith('authenticated-actor', 'authenticated-actor');
  });
  test('rejects owner spoofing before persistence and accepts valid org', async () => {
    const headers = {
      Authorization: 'Bearer valid',
      'Content-Type': 'application/json',
    };
    const bad = await fetch(base + '/organisations', {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: 'Club', type: 'CLUB', ownerId: 'victim' }),
    });
    expect(bad.status).toBe(400);
    expect(createOrganisation).not.toHaveBeenCalled();
    createOrganisation.mockResolvedValue({
      id: 'org',
      ownerId: 'authenticated-actor',
    });
    const good = await fetch(base + '/organisations', {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: 'Club', type: 'CLUB' }),
    });
    expect(good.status).toBe(201);
    expect(createOrganisation).toHaveBeenCalledWith('authenticated-actor', {
      name: 'Club',
      type: 'CLUB',
    });
  });
});
