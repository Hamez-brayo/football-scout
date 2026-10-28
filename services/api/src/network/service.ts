import { Prisma, PrismaClient } from '@prisma/client';
import {
  NetworkHttpsSchema,
  NetworkPaginationSchema,
  NetworkProfileInput,
  NetworkOrganisationInput,
  NetworkPostInput,
  NetworkOpportunityInput,
} from '@vysion/shared';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { canonicalPair, requireConnectionParticipant } from './policy';

export const profileSelect = {
  id: true,
  firstName: true,
  lastName: true,
  fullName: true,
  userType: true,
  headline: true,
  biography: true,
  expertise: true,
  currentLocation: true,
  position: true,
  currentClub: true,
  profilePhoto: true,
  videos: true,
  privacySettings: {
    select: { profileVisibility: true, mediaVisibility: true },
  },
  footballProfile: {
    select: {
      primaryPosition: true,
      currentClub: true,
      previousClubs: true,
      achievements: {
        select: { id: true, title: true, description: true },
        take: 30,
      },
    },
  },
} satisfies Prisma.UserSelect;
type SelectedProfile = Prisma.UserGetPayload<{ select: typeof profileSelect }>;
export function safeProfile(profile: SelectedProfile | null, actor: string) {
  if (!profile) return null;
  const { privacySettings, ...safe } = profile;
  if (
    profile.id !== actor &&
    privacySettings?.profileVisibility !== undefined &&
    privacySettings.profileVisibility !== 'public'
  )
    return null;
  if (
    profile.id !== actor &&
    privacySettings?.mediaVisibility !== undefined &&
    privacySettings.mediaVisibility !== 'public'
  ) {
    return { ...safe, videos: [], profilePhoto: null };
  }
  return {
    ...safe,
    profilePhoto:
      safe.profilePhoto && NetworkHttpsSchema.safeParse(safe.profilePhoto).success
        ? safe.profilePhoto
        : null,
    videos: safe.videos.filter((url) => NetworkHttpsSchema.safeParse(url).success),
  };
}
const organisationSelect = {
  id: true,
  name: true,
  type: true,
  description: true,
  location: true,
  website: true,
  ownerId: true,
  createdAt: true,
  owner: { select: profileSelect },
  members: { select: profileSelect, take: 50 },
} satisfies Prisma.NetworkOrganisationSelect;
const connectionSelect = {
  id: true,
  requesterId: true,
  recipientId: true,
  status: true,
  createdAt: true,
  requester: { select: profileSelect },
  recipient: { select: profileSelect },
} satisfies Prisma.NetworkConnectionSelect;
const postSelect = {
  id: true,
  authorId: true,
  body: true,
  category: true,
  mediaUrl: true,
  createdAt: true,
  author: { select: profileSelect },
} satisfies Prisma.NetworkPostSelect;
const opportunitySelect = {
  id: true,
  publisherId: true,
  organisationId: true,
  title: true,
  type: true,
  description: true,
  requirements: true,
  location: true,
  applicationUrl: true,
  expiresAt: true,
  status: true,
  createdAt: true,
  publisher: { select: profileSelect },
  organisation: { select: organisationSelect },
} satisfies Prisma.NetworkOpportunitySelect;
export const visibleProfile: Prisma.UserWhereInput = {
  OR: [{ privacySettings: null }, { privacySettings: { profileVisibility: 'public' } }],
};
const missing = () => new AppError(404, 'NOT_FOUND', 'Resource not found');
const forbidden = () => new AppError(403, 'FORBIDDEN', 'Insufficient permissions');

export class NetworkService {
  constructor(private readonly db: PrismaClient = prisma) {}
  private pagination(query: unknown) {
    const { page, limit } = NetworkPaginationSchema.parse(query);
    return { page, limit, skip: (page - 1) * limit, take: limit + 1 };
  }
  private page<T>(rows: T[], pagination: ReturnType<NetworkService['pagination']>) {
    return {
      items: rows.slice(0, pagination.limit),
      page: pagination.page,
      limit: pagination.limit,
      hasMore: rows.length > pagination.limit,
    };
  }
  async profile(id: string, actor: string) {
    const result = safeProfile(
      await this.db.user.findUnique({ where: { id }, select: profileSelect }),
      actor,
    );
    if (!result) throw missing();
    return result;
  }
  async profiles(actor: string, query: unknown, search?: string) {
    const pagination = this.pagination(query);
    const rows = await this.db.user.findMany({
      where: {
        AND: [
          visibleProfile,
          ...(search
            ? [
                {
                  OR: [
                    {
                      firstName: {
                        contains: search,
                        mode: 'insensitive' as const,
                      },
                    },
                    {
                      lastName: {
                        contains: search,
                        mode: 'insensitive' as const,
                      },
                    },
                    {
                      headline: {
                        contains: search,
                        mode: 'insensitive' as const,
                      },
                    },
                  ],
                },
              ]
            : []),
        ],
      },
      select: profileSelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: pagination.skip,
      take: pagination.take,
    });
    return this.page(
      rows.map((row) => safeProfile(row, actor)),
      pagination,
    );
  }
  async updateProfile(actor: string, input: NetworkProfileInput) {
    const { football, ...data } = input;
    let fullName: string | undefined;
    if (data.firstName !== undefined || data.lastName !== undefined) {
      const current = await this.db.user.findUnique({
        where: { id: actor },
        select: { firstName: true, lastName: true },
      });
      if (!current) throw missing();
      fullName = [data.firstName ?? current.firstName, data.lastName ?? current.lastName]
        .filter(Boolean)
        .join(' ');
    }
    await this.db.user.update({
      where: { id: actor },
      data: {
        ...data,
        ...(fullName !== undefined ? { fullName } : {}),
        ...(football
          ? {
              footballProfile: {
                upsert: {
                  create: {
                    ...football,
                    achievements: football.achievements
                      ? { create: football.achievements }
                      : undefined,
                  },
                  update: {
                    ...football,
                    achievements: football.achievements
                      ? { deleteMany: {}, create: football.achievements }
                      : undefined,
                  },
                },
              },
            }
          : {}),
      },
      select: { id: true },
    });
    return this.profile(actor, actor);
  }
  async organisations(actor: string, query: unknown) {
    const pagination = this.pagination(query);
    const rows = await this.db.networkOrganisation.findMany({
      select: organisationSelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: pagination.skip,
      take: pagination.take,
    });
    return this.page(
      rows.map((row) => ({
        ...row,
        owner: safeProfile(row.owner, actor),
        members: row.members
          .map((member) => safeProfile(member, actor))
          .filter((member) => member !== null),
      })),
      pagination,
    );
  }
  async organisation(id: string, actor: string) {
    const row = await this.db.networkOrganisation.findUnique({
      where: { id },
      select: organisationSelect,
    });
    if (!row) throw missing();
    return {
      ...row,
      owner: safeProfile(row.owner, actor),
      members: row.members
        .map((member) => safeProfile(member, actor))
        .filter((member) => member !== null),
    };
  }
  async createOrganisation(actor: string, input: NetworkOrganisationInput) {
    const row = await this.db.networkOrganisation.create({
      data: { ...input, ownerId: actor, members: { connect: { id: actor } } },
      select: { id: true },
    });
    return this.organisation(row.id, actor);
  }
  async updateOrganisation(id: string, actor: string, input: Partial<NetworkOrganisationInput>) {
    const organisation = await this.organisation(id, actor);
    if (organisation.ownerId !== actor) throw forbidden();
    await this.db.networkOrganisation.update({
      where: { id, ownerId: actor },
      data: input,
      select: { id: true },
    });
    return this.organisation(id, actor);
  }
  async membership(id: string, actor: string, joined: boolean) {
    await this.organisation(id, actor);
    await this.db.networkOrganisation.update({
      where: { id },
      data: {
        members: joined ? { connect: { id: actor } } : { disconnect: { id: actor } },
      },
      select: { id: true },
    });
    return this.organisation(id, actor);
  }
  async connections(actor: string, query: unknown) {
    const pagination = this.pagination(query);
    const rows = await this.db.networkConnection.findMany({
      where: { OR: [{ requesterId: actor }, { recipientId: actor }] },
      select: connectionSelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: pagination.skip,
      take: pagination.take,
    });
    return this.page(
      rows.map((row) => ({
        ...row,
        requester: safeProfile(row.requester, actor),
        recipient: safeProfile(row.recipient, actor),
      })),
      pagination,
    );
  }
  async requestConnection(actor: string, recipientId: string) {
    const pairKey = canonicalPair(actor, recipientId);
    await this.profile(recipientId, actor);
    return this.db.networkConnection.create({
      data: { pairKey, requesterId: actor, recipientId },
      select: {
        id: true,
        requesterId: true,
        recipientId: true,
        status: true,
        createdAt: true,
      },
    });
  }
  async respondConnection(id: string, actor: string, status: 'ACCEPTED' | 'DECLINED') {
    const result = await this.db.networkConnection.updateMany({
      where: { id, recipientId: actor, status: 'PENDING' },
      data: { status },
    });
    if (!result.count) throw forbidden();
    return { id, status };
  }
  private async conversation(id: string, actor: string) {
    const row = await this.db.networkConnection.findUnique({
      where: { id },
      select: { id: true, requesterId: true, recipientId: true, status: true },
    });
    if (!row) throw missing();
    requireConnectionParticipant(row, actor);
    return row;
  }
  async messages(id: string, actor: string, query: unknown) {
    await this.conversation(id, actor);
    const pagination = this.pagination(query);
    return this.page(
      await this.db.networkMessage.findMany({
        where: { connectionId: id },
        select: {
          id: true,
          connectionId: true,
          senderId: true,
          body: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: pagination.skip,
        take: pagination.take,
      }),
      pagination,
    );
  }
  async sendMessage(id: string, actor: string, body: string) {
    await this.conversation(id, actor);
    return this.db.networkMessage.create({
      data: { connectionId: id, senderId: actor, body },
      select: {
        id: true,
        connectionId: true,
        senderId: true,
        body: true,
        createdAt: true,
      },
    });
  }
  async posts(actor: string, query: unknown) {
    const pagination = this.pagination(query);
    const rows = await this.db.networkPost.findMany({
      where: { author: visibleProfile },
      select: postSelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: pagination.skip,
      take: pagination.take,
    });
    return this.page(
      rows.map((row) => ({
        ...row,
        author: safeProfile(row.author, actor),
        mediaUrl:
          row.author.id !== actor &&
          row.author.privacySettings &&
          row.author.privacySettings.mediaVisibility !== 'public'
            ? null
            : row.mediaUrl,
      })),
      pagination,
    );
  }
  async createPost(actor: string, input: NetworkPostInput) {
    const row = await this.db.networkPost.create({
      data: { ...input, authorId: actor },
      select: postSelect,
    });
    return { ...row, author: safeProfile(row.author, actor) };
  }
  async deletePost(id: string, actor: string) {
    const result = await this.db.networkPost.deleteMany({
      where: { id, authorId: actor },
    });
    if (!result.count) throw forbidden();
    return { id };
  }
  async opportunities(actor: string, query: unknown) {
    const pagination = this.pagination(query);
    const rows = await this.db.networkOpportunity.findMany({
      select: opportunitySelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: pagination.skip,
      take: pagination.take,
    });
    return this.page(
      rows.map((row) => {
        const actionable = row.status === 'OPEN' && row.expiresAt.getTime() > Date.now();
        return {
          ...row,
          actionable,
          applicationUrl: actionable ? row.applicationUrl : null,
          publisher: safeProfile(row.publisher, actor),
          organisation: row.organisation
            ? {
                ...row.organisation,
                owner: safeProfile(row.organisation.owner, actor),
                members: row.organisation.members
                  .map((member) => safeProfile(member, actor))
                  .filter((member) => member !== null),
              }
            : null,
        };
      }),
      pagination,
    );
  }
  async createOpportunity(actor: string, input: NetworkOpportunityInput) {
    if (input.organisationId) {
      const organisation = await this.organisation(input.organisationId, actor);
      if (organisation.ownerId !== actor) throw forbidden();
    }
    const row = await this.db.networkOpportunity.create({
      data: {
        ...input,
        expiresAt: new Date(input.expiresAt),
        publisherId: actor,
      },
      select: { id: true },
    });
    return { id: row.id };
  }
  async closeOpportunity(id: string, actor: string) {
    const result = await this.db.networkOpportunity.updateMany({
      where: {
        id,
        OR: [{ publisherId: actor }, { organisation: { ownerId: actor } }],
      },
      data: { status: 'CLOSED' },
    });
    if (!result.count) throw forbidden();
    return { id, status: 'CLOSED', actionable: false, applicationUrl: null };
  }
}
export const networkService = new NetworkService();
