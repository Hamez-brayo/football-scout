import express from 'express';
import type { Server } from 'http';
import jwt from 'jsonwebtoken';
import { UserRole } from '@vysion/shared';

const TEST_JWT_SECRET = 'test-route-groups-secret';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = TEST_JWT_SECRET;
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/vysion_db';

jest.mock('@/controllers/userController', () => ({
  userController: {
    getCurrentUser: (_req: any, res: any) =>
      res.status(200).json({ success: true, data: { userId: 'user-1' } }),
    getUserById: (_req: any, res: any) =>
      res.status(200).json({ success: true, data: { userId: 'user-2' } }),
    updateProfile: (_req: any, res: any) =>
      res.status(200).json({ success: true, data: { updated: true } }),
    updatePhysicalAttributes: (_req: any, res: any) =>
      res.status(200).json({ success: true, data: { updated: true } }),
    updateFootballProfile: (_req: any, res: any) =>
      res.status(200).json({ success: true, data: { updated: true } }),
    deleteAccount: (_req: any, res: any) =>
      res.status(200).json({ success: true, data: { deleted: true } }),
  },
}));

jest.mock('@/controllers/trainingController', () => ({
  trainingController: {
    listPrograms: (_req: any, res: any) =>
      res.status(200).json({ success: true, data: [] }),
    createProgram: (_req: any, res: any) =>
      res.status(201).json({ success: true, data: { id: 'program-1' } }),
    listDrills: (_req: any, res: any) =>
      res.status(200).json({ success: true, data: [] }),
    createDrill: (_req: any, res: any) =>
      res.status(201).json({ success: true, data: { id: 'drill-1' } }),
    submitDrill: (_req: any, res: any) =>
      res.status(201).json({ success: true, data: { id: 'submission-1' } }),
  },
}));

jest.mock('@/controllers/statsController', () => ({
  statsController: {
    getPlayerStats: (_req: any, res: any) =>
      res.status(200).json({ success: true, data: { entries: [] } }),
    createPlayerStat: (_req: any, res: any) =>
      res.status(201).json({ success: true, data: { id: 'stat-1' } }),
  },
}));

jest.mock('@/controllers/scoutController', () => ({
  scoutController: {
    searchPlayers: (_req: any, res: any) =>
      res.status(200).json({ success: true, data: { items: [] } }),
    addToShortlist: (_req: any, res: any) =>
      res.status(201).json({ success: true, data: { id: 'shortlist-1' } }),
    removeFromShortlist: (_req: any, res: any) =>
      res.status(200).json({ success: true, data: { deleted: true } }),
  },
}));

type ApiResult = {
  status: number;
  body: any;
};

describe('Route Group Integration (401/403/200)', () => {
  let server: Server;
  let baseUrl = '';

  const signToken = (role: UserRole, userId = 'player-1') =>
    jwt.sign(
      {
        userId,
        email: `${userId}@example.com`,
        role,
      },
      TEST_JWT_SECRET,
      { expiresIn: '1h' }
    );

  const callApi = async (
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    options?: {
      token?: string;
      body?: unknown;
    }
  ): Promise<ApiResult> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options?.token) {
      headers.Authorization = `Bearer ${options.token}`;
    }

    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

    let body: any = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    return {
      status: response.status,
      body,
    };
  };

  beforeAll(async () => {
    jest.resetModules();

    const userRoutes = require('../src/routes/users').default;
    const trainingRoutes = require('../src/routes/training').default;
    const statsRoutes = require('../src/routes/stats').default;
    const scoutRoutes = require('../src/routes/scout').default;

    const app = express();
    app.use(express.json());

    app.use('/api/users', userRoutes);
    app.use('/api/training', trainingRoutes);
    app.use('/api/stats', statsRoutes);
    app.use('/api/scout', scoutRoutes);

    app.use((err: any, _req: any, res: any, _next: any) => {
      res.status(500).json({
        success: false,
        error: {
          message: err?.message || 'Unhandled test error',
        },
      });
    });

    await new Promise<void>((resolve) => {
      server = app.listen(0, () => resolve());
    });

    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('Failed to bind test server');
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  });

  describe('/api/users', () => {
    it('returns 401 when unauthenticated', async () => {
      const result = await callApi('GET', '/api/users/me');
      expect(result.status).toBe(401);
    });

    it('returns 403 for PLAYER on SCOUT-only endpoint', async () => {
      const playerToken = signToken(UserRole.PLAYER, 'player-1');
      const result = await callApi('GET', '/api/users/scout-visible-user', {
        token: playerToken,
      });
      expect(result.status).toBe(403);
    });

    it('returns 200 for authenticated /me', async () => {
      const playerToken = signToken(UserRole.PLAYER, 'player-1');
      const result = await callApi('GET', '/api/users/me', {
        token: playerToken,
      });
      expect(result.status).toBe(200);
    });
  });

  describe('/api/training', () => {
    it('returns 401 when unauthenticated', async () => {
      const result = await callApi('GET', '/api/training/programs');
      expect(result.status).toBe(401);
    });

    it('returns 403 for PLAYER on SCOUT-only endpoint', async () => {
      const playerToken = signToken(UserRole.PLAYER, 'player-1');
      const result = await callApi('POST', '/api/training/programs', {
        token: playerToken,
        body: {
          title: 'Program A',
          level: 'Academy',
          positionFocus: 'Midfielder',
        },
      });
      expect(result.status).toBe(403);
    });

    it('returns 200 for authenticated list programs', async () => {
      const scoutToken = signToken(UserRole.SCOUT, 'scout-1');
      const result = await callApi('GET', '/api/training/programs', {
        token: scoutToken,
      });
      expect(result.status).toBe(200);
    });
  });

  describe('/api/stats', () => {
    it('returns 401 when unauthenticated', async () => {
      const result = await callApi('GET', '/api/stats/player-1');
      expect(result.status).toBe(401);
    });

    it('returns 403 for PLAYER reading another player stats', async () => {
      const playerToken = signToken(UserRole.PLAYER, 'player-99');
      const result = await callApi('GET', '/api/stats/player-1', {
        token: playerToken,
      });
      expect(result.status).toBe(403);
    });

    it('returns 200 for PLAYER reading own stats', async () => {
      const playerToken = signToken(UserRole.PLAYER, 'player-1');
      const result = await callApi('GET', '/api/stats/player-1', {
        token: playerToken,
      });
      expect(result.status).toBe(200);
    });
  });

  describe('/api/scout', () => {
    it('returns 401 when unauthenticated', async () => {
      const result = await callApi('GET', '/api/scout/search');
      expect(result.status).toBe(401);
    });

    it('returns 403 for PLAYER access', async () => {
      const playerToken = signToken(UserRole.PLAYER, 'player-1');
      const result = await callApi('GET', '/api/scout/search', {
        token: playerToken,
      });
      expect(result.status).toBe(403);
    });

    it('returns 200 for SCOUT access', async () => {
      const scoutToken = signToken(UserRole.SCOUT, 'scout-1');
      const result = await callApi('GET', '/api/scout/search', {
        token: scoutToken,
      });
      expect(result.status).toBe(200);
    });
  });
});
