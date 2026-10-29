import { beforeEach, expect, jest, test } from '@jest/globals';
const findUnique = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const findFirst = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const update = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const organisationUpdate = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const prismaMock = {
  user: { findUnique, findFirst, update },
  networkOrganisation: { findUnique, update: organisationUpdate },
};
jest.mock('../src/config/database', () => ({ prisma: prismaMock }));
import { NetworkProfileSchema } from '../../../packages/shared/src/network';
import { NetworkService } from '../src/network/service';
import { PlayerService } from '../src/services/playerService';
import { UserService } from '../src/services/userService';
const profile = {
  id: 'a',
  userId: 'firebase-a',
  userType: 'TALENT',
  firstName: 'Ada',
  lastName: 'Smith',
  fullName: 'Ada Smith',
  password: 'secret',
  videos: ['https://example.com/v'],
  profilePhoto: 'https://example.com/p',
  privacySettings: { profileVisibility: 'private', mediaVisibility: 'private' },
};
beforeEach(() => {
  jest.resetAllMocks();
});
test('private player owner receives own profile after create and update; outsiders remain hidden', async () => {
  findUnique.mockResolvedValue(profile);
  update.mockResolvedValue(profile);
  const players = new PlayerService();
  for (const action of ['createPlayerProfile', 'updatePlayerProfile'] as const) {
    const result = await players[action]('firebase-a', {});
    expect(result.id).toBe('a');
    expect(result).not.toHaveProperty('password');
  }
  await expect(players.getPlayerById('a')).rejects.toMatchObject({ statusCode: 404 });
  await expect(new UserService().getUserById('a')).rejects.toMatchObject({ statusCode: 404 });
});
test('partial network name updates recompute fullName from resulting names', async () => {
  findUnique.mockResolvedValue(profile);
  update.mockResolvedValue(profile);
  await new NetworkService().updateProfile('a', { firstName: 'Grace' });
  expect(update).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({ firstName: 'Grace', fullName: 'Grace Smith' }),
    }),
  );
});
test('membership join and leave only mutate authenticated member', async () => {
  findUnique.mockResolvedValue({ id: 'org', owner: null, members: [] });
  organisationUpdate.mockResolvedValue({ id: 'org' });
  const service = new NetworkService();
  await service.membership('org', 'a', true);
  await service.membership('org', 'a', false);
  expect(organisationUpdate).toHaveBeenNthCalledWith(1, {
    where: { id: 'org' },
    data: { members: { connect: { id: 'a' } } },
    select: { id: true },
  });
  expect(organisationUpdate).toHaveBeenNthCalledWith(2, {
    where: { id: 'org' },
    data: { members: { disconnect: { id: 'a' } } },
    select: { id: true },
  });
});
test('legacy public detail hides private media and secrets', async () => {
  const { password, userId, ...publicProfile } = profile;
  findUnique.mockResolvedValue({
    ...publicProfile,
    privacySettings: { profileVisibility: 'public', mediaVisibility: 'private' },
  });
  const result = await new PlayerService().getPlayerById('a');
  expect(result.videos).toEqual([]);
  expect(result.profilePhoto).toBeNull();
  expect(result).not.toHaveProperty('password');
  expect(result).not.toHaveProperty('userId');
});
test('legacy statistics use full internal completeness inputs and uncapped record aggregates', async () => {
  findUnique.mockResolvedValue({
    ...profile,
    privacySettings: { profileVisibility: 'public', mediaVisibility: 'public' },
    footballProfile: { achievements: [] },
  });
  findFirst.mockResolvedValue({
    ...profile,
    dateOfBirth: '2000-01-01',
    nationality: 'GB',
    currentLocation: 'London',
    position: 'Forward',
    currentClub: 'Club',
    physicalAttributes: { height: 180, weight: 75 },
    footballProfile: {
      primaryPosition: 'Forward',
      experience: 'PRO',
      _count: { achievements: 45 },
    },
    _count: { media: 80 },
    privacySettings: { mediaVisibility: 'public' },
  });
  const result = await new PlayerService().getPlayerStats('a');
  expect(result).toEqual({
    playerId: 'a',
    profileCompleteness: 100,
    mediaCount: 80,
    achievementsCount: 45,
  });
  expect(result).not.toHaveProperty('dateOfBirth');
});

test('legacy stats do not fetch internal aggregates for private profiles', async () => {
  findUnique.mockResolvedValue(profile);
  await expect(new PlayerService().getPlayerStats('a')).rejects.toMatchObject({ statusCode: 404 });
  expect(findFirst).not.toHaveBeenCalled();
});

test('legacy stats suppress media totals when media visibility is private', async () => {
  const { password, userId, ...publicProfile } = profile;
  findUnique.mockResolvedValue({
    ...publicProfile,
    privacySettings: { profileVisibility: 'public', mediaVisibility: 'private' },
  });
  findFirst.mockResolvedValue({
    ...publicProfile,
    physicalAttributes: null,
    footballProfile: null,
    privacySettings: { mediaVisibility: 'private' },
    _count: { media: 100 },
  });
  const result = await new PlayerService().getPlayerStats('a');
  expect(result.mediaCount).toBe(0);
});

test('network profile reads existing experience through the safe selector', async () => {
  const footballProfile = {
    primaryPosition: null,
    currentClub: null,
    previousClubs: [],
    achievements: [],
    experience: 'PRO',
  };
  // Simulate the projection: unselected persisted fields must not appear by accident.
  findUnique.mockImplementation(async (args) => {
    const select = (args as { select: { footballProfile: { select: Record<string, boolean> } } })
      .select.footballProfile.select;
    return {
      ...profile,
      footballProfile: Object.fromEntries(
        Object.entries(footballProfile).filter(([key]) => select[key]),
      ),
    };
  });
  const result = await new NetworkService().profile('a', 'a');
  expect(result.footballProfile).toHaveProperty('experience', 'PRO');
});

test.each(['AMATEUR', 'ACADEMY', 'SEMI_PRO', 'PRO', null])(
  'network experience %s validates and updates existing storage',
  async (experience) => {
    const input = NetworkProfileSchema.parse({ football: { experience } });
    findUnique.mockResolvedValue({ ...profile, footballProfile: { experience } });
    update.mockResolvedValue({ id: 'a' });
    const result = await new NetworkService().updateProfile('a', input);
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          footballProfile: {
            upsert: {
              create: { experience, achievements: undefined },
              update: { experience, achievements: undefined },
            },
          },
        },
      }),
    );
    expect(result.footballProfile).toHaveProperty('experience', experience);
  },
);

test('network experience rejects unsupported enums and unknown football fields', () => {
  expect(NetworkProfileSchema.safeParse({ football: { experience: 'EXPERT' } }).success).toBe(
    false,
  );
  expect(
    NetworkProfileSchema.safeParse({ football: { experience: 'PRO', years: 4 } }).success,
  ).toBe(false);
});
