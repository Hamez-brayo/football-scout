import { afterAll, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import express from 'express';
import type { Server } from 'http';

const verifyIdToken = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const revokeRefreshTokens = jest.fn<(...args: unknown[]) => Promise<void>>();
const findUnique = jest.fn<(...args: unknown[]) => Promise<unknown>>();
// External Firebase and database operations stay isolated; route and middleware are real.
jest.mock('../src/config/firebase', () => ({
  auth: {
    verifyIdToken: (...args: unknown[]) => verifyIdToken(...args),
    revokeRefreshTokens: (...args: unknown[]) => revokeRefreshTokens(...args),
  },
}));
jest.mock('../src/config/database', () => ({
  prisma: {
    user: {
      findUnique: (...args: unknown[]) => findUnique(...args),
    },
  },
}));
jest.mock('../src/config/logger', () => ({ logger: { error: jest.fn() } }));
jest.mock('../src/services/userService', () => ({ userService: {} }));
jest.mock('../src/services/authService', () => ({ authService: {} }));
import router from '../src/routes/auth';
import { errorHandler } from '../src/middleware/errorHandler';
let server: Server;
let base: string;
beforeAll(async () => {
  const app = express();
  app.use(express.json());
  app.use('/auth', router);
  app.use(errorHandler);
  server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Expected test listener');
  base = `http://127.0.0.1:${address.port}/auth/signout`;
});
afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});
beforeEach(() => {
  jest.clearAllMocks();
  verifyIdToken.mockResolvedValue({ uid: 'actor-uid' });
  findUnique.mockResolvedValue({
    id: 'actor-db-id',
    userId: 'actor-uid',
    email: 'actor@example.test',
    userType: 'TALENT',
  });
  revokeRefreshTokens.mockResolvedValue(undefined);
});
const post = (body: unknown, token?: string) =>
  fetch(base, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
describe('Firebase signout authorization', () => {
  test('rejects unauthenticated revocation without contacting Firebase', async () => {
    expect((await post({ userId: 'victim-uid' })).status).toBe(401);
    expect(revokeRefreshTokens).not.toHaveBeenCalled();
  });
  test('revokes only the authenticated UID even when a different UID is supplied', async () => {
    const response = await post({ userId: 'victim-uid' }, 'valid-id-token');
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ success: true });
    expect(revokeRefreshTokens).toHaveBeenCalledTimes(1);
    expect(revokeRefreshTokens).toHaveBeenCalledWith('actor-uid');
  });
  test('does not revoke anything for an invalid Firebase token', async () => {
    verifyIdToken.mockRejectedValueOnce(
      Object.assign(new Error('Invalid token'), { code: 'auth/argument-error' }),
    );
    expect((await post({ userId: 'victim-uid' }, 'invalid')).status).toBe(401);
    expect(revokeRefreshTokens).not.toHaveBeenCalled();
  });
  test.each(['auth/network-request-failed', 'auth/internal-error'])(
    'returns a recoverable server failure for Firebase infrastructure error %s',
    async (code) => {
      verifyIdToken.mockRejectedValueOnce(
        Object.assign(new Error('Firebase unavailable'), { code }),
      );
      expect((await post({}, 'valid-id-token')).status).toBe(500);
      expect(revokeRefreshTokens).not.toHaveBeenCalled();
    },
  );
  test('returns a recoverable server failure when the account database is unavailable', async () => {
    findUnique.mockRejectedValueOnce(new Error('Database unavailable'));
    expect((await post({}, 'valid-id-token')).status).toBe(500);
    expect(revokeRefreshTokens).not.toHaveBeenCalled();
  });
  test.each([
    'auth/id-token-expired',
    'auth/id-token-revoked',
    'auth/invalid-id-token',
    'auth/user-disabled',
  ])('rejects a confirmed Firebase identity error %s', async (code) => {
    verifyIdToken.mockRejectedValueOnce(Object.assign(new Error('Invalid identity'), { code }));
    expect((await post({}, 'invalid')).status).toBe(401);
    expect(revokeRefreshTokens).not.toHaveBeenCalled();
  });
  test('does not fabricate success when Firebase revocation fails', async () => {
    revokeRefreshTokens.mockRejectedValueOnce(new Error('Unavailable'));
    expect((await post({}, 'valid-id-token')).status).toBe(500);
  });
});
