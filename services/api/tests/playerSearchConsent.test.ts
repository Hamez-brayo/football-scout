import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const findUnique = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const findMany = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const updateMany = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const count = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const mockDatabase = { user: { findUnique, findMany, updateMany, count } };
jest.mock('../src/config/database', () => ({ prisma: mockDatabase }));
const { NetworkService } = require('../src/network/service') as typeof import('../src/network/service');
const { PlayerService } = require('../src/services/playerService') as typeof import('../src/services/playerService');
const service = new NetworkService(mockDatabase as never);

beforeEach(() => jest.resetAllMocks());

describe('player search consent', () => {
  test('only the current player can read and change their own setting', async () => {
    findUnique.mockResolvedValue({ userType: 'TALENT', playerSearchEnabled: false });
    await expect(service.playerSearchPreference('owner')).resolves.toEqual({ enabled: false });
    expect(findUnique).toHaveBeenCalledWith({
      where: { id: 'owner' }, select: { userType: true, playerSearchEnabled: true },
    });
    updateMany.mockResolvedValue({ count: 1 });
    await expect(service.setPlayerSearchPreference('owner', true)).resolves.toEqual({ enabled: true });
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: 'owner', userType: 'TALENT' }, data: { playerSearchEnabled: true },
    });
    await service.setPlayerSearchPreference('owner', false);
    expect(updateMany).toHaveBeenLastCalledWith({
      where: { id: 'owner', userType: 'TALENT' }, data: { playerSearchEnabled: false },
    });
  });

  test('non-player accounts cannot change or read player search consent', async () => {
    findUnique.mockResolvedValue({ userType: 'AGENT', playerSearchEnabled: false });
    await expect(service.playerSearchPreference('agent')).rejects.toMatchObject({ statusCode: 403 });
    updateMany.mockResolvedValue({ count: 0 });
    await expect(service.setPlayerSearchPreference('agent', true)).rejects.toMatchObject({ statusCode: 403 });
  });

  test('network directory restricts player records before pagination but keeps other users', async () => {
    findMany.mockResolvedValue([]);
    await service.profiles('scout', { page: 2, limit: 10 });
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({
      skip: 10, take: 11,
      where: { AND: [
        { OR: [{ privacySettings: null }, { privacySettings: { profileVisibility: 'public' } }] },
        { OR: [{ userType: null }, { userType: { not: 'TALENT' } }, { playerSearchEnabled: true }] },
      ] },
    }));
  });

  test('legacy search filters on consent before fetching and counting', async () => {
    findMany.mockResolvedValue([]);
    count.mockResolvedValue(0);
    await new PlayerService().searchPlayers({ page: 1, limit: 10 });
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ userType: 'TALENT', playerSearchEnabled: true }),
      skip: 0, take: 10,
    }));
    expect(count).toHaveBeenCalledWith({
      where: expect.objectContaining({ userType: 'TALENT', playerSearchEnabled: true }),
    });
  });
});
