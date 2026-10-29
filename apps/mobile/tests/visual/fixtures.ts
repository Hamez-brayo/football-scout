import { NetworkProfileSchema } from '@vysion/shared';
import type {
  NetworkProfile,
  NetworkPost,
  NetworkOpportunity,
  NetworkOrganisation,
  NetworkConnection,
  NetworkMessage,
} from '@vysion/shared';

// Test-only data. This module is never imported by the application entry point.
export const me: NetworkProfile = {
  id: 'fixture-player',
  firstName: 'Amani',
  lastName: 'Otieno',
  fullName: 'Amani Otieno',
  userType: 'TALENT',
  headline: 'Winger · Creating space and making connections',
  biography:
    'Nairobi-based player building a career in football. Available for development opportunities.',
  expertise: ['Dribbling', 'Chance creation'],
  currentLocation: 'Nairobi, Kenya',
  position: 'Winger',
  currentClub: 'Nairobi City Development',
  profilePhoto: null,
  videos: [],
  footballProfile: null,
};
const scout: NetworkProfile = {
  ...me,
  id: 'fixture-scout',
  firstName: 'Neema',
  lastName: 'Kamau',
  fullName: 'Neema Kamau',
  userType: 'SCOUT',
  headline: 'Youth development scout · East Africa',
  position: null,
  currentClub: 'City Football Academy',
  expertise: ['Talent identification'],
};
const club: NetworkOrganisation = {
  id: 'fixture-club',
  name: 'City Football Academy',
  type: 'CLUB',
  description: 'A development community for ambitious young footballers.',
  location: 'Nairobi, Kenya',
  website: null,
  ownerId: scout.id,
  owner: scout,
  members: [scout],
  createdAt: '2026-10-28T10:00:00Z',
};
let profiles = [me, scout];
let posts: NetworkPost[] = [
  {
    id: 'fixture-post',
    authorId: scout.id,
    author: scout,
    body: 'Football opens doors when we share our work. Great energy at the academy training session today — excited to connect with players and coaches across East Africa.',
    category: 'TRAINING',
    mediaUrl: null,
    createdAt: '2026-10-29T08:00:00Z',
  },
];
const openings: NetworkOpportunity[] = [
  {
    id: 'fixture-opportunity',
    publisherId: scout.id,
    organisationId: club.id,
    title: 'Development squad open trials',
    type: 'TRIAL',
    description:
      'An open assessment session for committed players ready to take the next step.',
    requirements: 'Bring your boots, training kit and a short player profile.',
    location: 'Nairobi, Kenya',
    applicationUrl: 'https://example.com/trials',
    expiresAt: '2099-12-31T23:59:00Z',
    status: 'OPEN',
    createdAt: '2026-10-29T08:00:00Z',
    publisher: scout,
    organisation: club,
    actionable: true,
  },
];
const connections: NetworkConnection[] = [
  {
    id: 'fixture-connection',
    requesterId: me.id,
    recipientId: scout.id,
    status: 'ACCEPTED',
    createdAt: '2026-10-28T09:00:00Z',
    requester: me,
    recipient: scout,
  },
];
let messages: NetworkMessage[] = [
  {
    id: 'fixture-message',
    connectionId: connections[0].id,
    senderId: scout.id,
    body: 'Thanks for connecting, Amani. What position do you play?',
    createdAt: '2026-10-29T08:15:00Z',
  },
];
export const fixtureState = {
  writes: [] as { method: string; path: string; data: unknown }[],
  failNext: '',
};
declare global {
  interface Window {
    vysionFixture: typeof fixtureState;
  }
}
window.vysionFixture = fixtureState;
const page = <T>(items: T[]) => ({ items, page: 1, limit: 20, hasMore: false });
function checkFailure(path: string) {
  if (fixtureState.failNext && path.startsWith(fixtureState.failNext)) {
    fixtureState.failNext = '';
    throw new Error('Fixture API unavailable. Retry to recover.');
  }
}
export const NetworkService = {
  async get<T>(path: string): Promise<T> {
    checkFailure(path);
    if (path === '/me') return profiles[0] as T;
    if (path.startsWith('/profiles/'))
      return profiles.find((p) => p.id === path.split('/')[2]) as T;
    if (path.startsWith('/organisations/')) return club as T;
    throw new Error(`Unsupported fixture GET ${path}`);
  },
  async list<T>(path: string, _page: number): Promise<T> {
    checkFailure(path);
    let result: unknown;
    if (path.startsWith('/posts')) result = page(posts);
    else if (path.startsWith('/profiles')) {
      const query =
        new URL(path, 'http://fixture.local').searchParams
          .get('search')
          ?.toLowerCase() || '';
      result = page(
        profiles.filter((p) =>
          `${p.fullName} ${p.headline}`.toLowerCase().includes(query),
        ),
      );
    } else if (path.startsWith('/organisations')) result = page([club]);
    else if (path.startsWith('/opportunities')) result = page(openings);
    else if (path.endsWith('/messages')) result = page(messages);
    else if (path.startsWith('/connections')) result = page(connections);
    else throw new Error(`Unsupported fixture LIST ${path}`);
    return result as T;
  },
  async write<T>(
    method: string,
    path: string,
    data?: Record<string, unknown>,
  ): Promise<T> {
    checkFailure(path);
    fixtureState.writes.push({ method, path, data });
    if (method === 'post' && path === '/posts') {
      const post = {
        id: `fixture-post-${posts.length}`,
        authorId: me.id,
        author: profiles[0],
        body: String(data?.body),
        category: String(data?.category),
        mediaUrl: null,
        createdAt: '2026-10-29T09:00:00Z',
      };
      posts = [post, ...posts];
      return post as T;
    }
    if (method === 'patch' && path === '/me') {
      const { football, ...fields } = NetworkProfileSchema.parse(data);
      const current = profiles[0];
      const next: NetworkProfile = { ...current, ...fields };
      next.fullName = [next.firstName, next.lastName].filter(Boolean).join(' ');
      if (football) {
        const existing = current.footballProfile;
        next.footballProfile = {
          primaryPosition:
            football.primaryPosition ?? existing?.primaryPosition ?? null,
          currentClub: football.currentClub ?? existing?.currentClub ?? null,
          experience:
            football.experience !== undefined
              ? football.experience
              : (existing?.experience ?? null),
          previousClubs:
            football.previousClubs ?? existing?.previousClubs ?? [],
          achievements: football.achievements
            ? football.achievements.map((achievement, index) => ({
                id: `fixture-achievement-${index}`,
                title: achievement.title,
                description: achievement.description ?? null,
              }))
            : (existing?.achievements ?? []),
        };
      }
      profiles = [next, ...profiles.slice(1)];
      return profiles[0] as T;
    }
    if (method === 'post' && path.endsWith('/messages')) {
      const message = {
        id: `fixture-message-${messages.length}`,
        connectionId: connections[0].id,
        senderId: me.id,
        body: String(data?.body),
        createdAt: '2026-10-29T09:01:00Z',
      };
      messages = [message, ...messages];
      return message as T;
    }
    throw new Error(`Unsupported fixture ${method} ${path}`);
  },
};
