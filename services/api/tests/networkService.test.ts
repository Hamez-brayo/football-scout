import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
jest.mock('../src/config/database', () => ({ prisma: {} }));
import { NetworkService, profileSelect, safeProfile } from '../src/network/service';

const findUnique = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const updateMany = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const create = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const findMany = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const db = {
  networkConnection: { findUnique, updateMany, create },
  networkMessage: { findMany, create },
  networkPost: { findMany, deleteMany: updateMany },
  networkOpportunity: { findMany, updateMany, create },
  user: { findUnique },
  networkOrganisation: { findUnique, create },
} as unknown as PrismaClient;
const service = new NetworkService(db);
const profile = {
  id: 'a',
  firstName: 'A',
  lastName: null,
  fullName: null,
  userType: 'TALENT' as const,
  headline: null,
  biography: null,
  expertise: [],
  currentLocation: null,
  position: null,
  currentClub: null,
  profilePhoto: 'https://example.com/p.jpg',
  videos: ['https://example.com/v'],
  footballProfile: null,
  privacySettings: { profileVisibility: 'public', mediaVisibility: 'public' },
};
beforeEach(() => {
  jest.clearAllMocks();
});
describe('persistent network service boundaries', () => {
  test('profile selector does not fetch secrets and private profiles/media are redacted', () => {
    for (const secret of ['password', 'email', 'phone', 'documents', 'dateOfBirth', 'userId']) {
      expect(profileSelect).not.toHaveProperty(secret);
    }
    expect(
      safeProfile(
        {
          ...profile,
          privacySettings: {
            profileVisibility: 'private',
            mediaVisibility: 'public',
          },
        },
        'b',
      ),
    ).toBeNull();
    const safe = safeProfile(
      {
        ...profile,
        privacySettings: {
          profileVisibility: 'public',
          mediaVisibility: 'private',
        },
      },
      'b',
    );
    expect(safe?.videos).toEqual([]);
    expect(safe?.profilePhoto).toBeNull();
    expect(safe).not.toHaveProperty('privacySettings');
  });
  test('sender cannot accept and repeat transitions require pending recipient match', async () => {
    updateMany.mockResolvedValue({ count: 0 });
    await expect(service.respondConnection('c', 'sender', 'ACCEPTED')).rejects.toMatchObject({
      statusCode: 403,
    });
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: 'c', recipientId: 'sender', status: 'PENDING' },
      data: { status: 'ACCEPTED' },
    });
    updateMany.mockResolvedValue({ count: 1 });
    await expect(service.respondConnection('c', 'recipient', 'DECLINED')).resolves.toEqual({
      id: 'c',
      status: 'DECLINED',
    });
  });
  test('outsiders and pending connections cannot read or write messages', async () => {
    findUnique.mockResolvedValue({
      id: 'c',
      requesterId: 'a',
      recipientId: 'b',
      status: 'ACCEPTED',
    });
    await expect(service.messages('c', 'x', {})).rejects.toMatchObject({
      statusCode: 403,
    });
    await expect(service.sendMessage('c', 'x', 'hello')).rejects.toMatchObject({
      statusCode: 403,
    });
    findUnique.mockResolvedValue({
      id: 'c',
      requesterId: 'a',
      recipientId: 'b',
      status: 'PENDING',
    });
    await expect(service.sendMessage('c', 'a', 'hello')).rejects.toMatchObject({
      statusCode: 403,
    });
    expect(create).not.toHaveBeenCalled();
    expect(findMany).not.toHaveBeenCalled();
  });
  test('accepted participants send persisted messages with authenticated sender', async () => {
    findUnique.mockResolvedValue({
      id: 'c',
      requesterId: 'a',
      recipientId: 'b',
      status: 'ACCEPTED',
    });
    create.mockResolvedValue({ id: 'm', body: 'hello' });
    await service.sendMessage('c', 'a', 'hello');
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { connectionId: 'c', senderId: 'a', body: 'hello' },
      }),
    );
  });
  test('expired/closed opportunities lose application action and nested private owners', async () => {
    findMany.mockResolvedValue([
      {
        id: 'o',
        status: 'OPEN',
        expiresAt: new Date(0),
        applicationUrl: 'https://example.com',
        publisher: {
          ...profile,
          privacySettings: {
            profileVisibility: 'private',
            mediaVisibility: 'private',
          },
        },
        organisation: null,
      },
      {
        id: 'p',
        status: 'CLOSED',
        expiresAt: new Date('2099-01-01'),
        applicationUrl: 'https://example.com',
        publisher: profile,
        organisation: null,
      },
    ]);
    const page = await service.opportunities('b', {});
    expect(page.items.every((item) => !item.actionable && item.applicationUrl === null)).toBe(true);
    expect(page.items[0].publisher).toBeNull();
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 21, skip: 0 }));
  });
  test('foreign organisation cannot publish and deletion/closing are actor scoped', async () => {
    findUnique.mockResolvedValue({
      id: 'org',
      ownerId: 'other',
      owner: profile,
      members: [],
    });
    await expect(
      service.createOpportunity('a', {
        title: 'Trial',
        type: 'TRIAL',
        description: 'Details',
        requirements: 'Boots',
        location: 'London',
        applicationUrl: 'https://example.com',
        expiresAt: '2099-01-01T00:00:00Z',
        organisationId: 'org',
      }),
    ).rejects.toMatchObject({ statusCode: 403 });
    expect(create).not.toHaveBeenCalled();
    updateMany.mockResolvedValue({ count: 0 });
    await expect(service.deletePost('p', 'a')).rejects.toMatchObject({
      statusCode: 403,
    });
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: 'p', authorId: 'a' },
    });
    await expect(service.closeOpportunity('o', 'a')).rejects.toMatchObject({
      statusCode: 403,
    });
    expect(updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: 'o',
          OR: [{ publisherId: 'a' }, { organisation: { ownerId: 'a' } }],
        },
      }),
    );
  });
});
