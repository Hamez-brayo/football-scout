import { requireUserType } from '../src/middleware/auth';
import { UserRole } from '@vysion/shared';

type MockResponse = {
  status: jest.Mock;
  json: jest.Mock;
};

const createMockResponse = (): MockResponse => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  return res;
};

describe('RBAC middleware guards', () => {
  it('returns 403 when SCOUT hits PLAYER-only route', () => {
    const req: any = {
      user: {
        userId: 'scout-1',
        email: 'scout@example.com',
        role: UserRole.SCOUT,
      },
    };

    const res = createMockResponse();
    const next = jest.fn();

    requireUserType(UserRole.PLAYER)(req, res as any, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('returns 403 when PLAYER hits SCOUT-only route', () => {
    const req: any = {
      user: {
        userId: 'player-1',
        email: 'player@example.com',
        role: UserRole.PLAYER,
      },
    };

    const res = createMockResponse();
    const next = jest.fn();

    requireUserType(UserRole.SCOUT)(req, res as any, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('returns 401 for protected route with no auth context', () => {
    const req: any = {};
    const res = createMockResponse();
    const next = jest.fn();

    requireUserType(UserRole.PLAYER, UserRole.SCOUT)(req, res as any, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
