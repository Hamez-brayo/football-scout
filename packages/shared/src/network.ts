import { z } from 'zod';

const text = (max: number) => z.string().trim().min(1).max(max);
export const NetworkHttpsSchema = z
  .string()
  .url()
  .max(2048)
  .refine((value) => {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  }, 'Use an HTTPS URL without credentials');
export const NetworkPaginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export const NetworkProfileSchema = z
  .object({
    firstName: text(50).optional(),
    lastName: text(50).optional(),
    headline: text(160).nullable().optional(),
    biography: text(3000).nullable().optional(),
    expertise: z.array(text(80)).max(20).optional(),
    currentLocation: text(120).nullable().optional(),
    position: text(80).nullable().optional(),
    currentClub: text(120).nullable().optional(),
    videos: z.array(NetworkHttpsSchema).max(20).optional(),
    profilePhoto: NetworkHttpsSchema.nullable().optional(),
    userType: z.enum(['TALENT', 'SCOUT', 'COACH', 'AGENT', 'CLUB']).optional(),
    football: z
      .object({
        primaryPosition: text(80).optional(),
        currentClub: text(120).optional(),
        previousClubs: z.array(text(120)).max(30).optional(),
        achievements: z
          .array(z.object({ title: text(150), description: text(1000).optional() }).strict())
          .max(30)
          .optional(),
      })
      .strict()
      .optional(),
  })
  .strict();
export const NetworkOrganisationSchema = z
  .object({
    name: text(150),
    type: z.enum(['CLUB', 'AGENCY']),
    description: text(3000).nullable().optional(),
    location: text(150).nullable().optional(),
    website: NetworkHttpsSchema.nullable().optional(),
  })
  .strict();
export const NetworkPostSchema = z
  .object({
    body: text(3000),
    category: z.enum(['MATCH_FOOTAGE', 'TRAINING', 'ACHIEVEMENT', 'TEAM_UPDATE', 'RECRUITMENT']),
    mediaUrl: NetworkHttpsSchema.optional(),
  })
  .strict();
export const NetworkOpportunitySchema = z
  .object({
    title: text(150),
    type: z.enum(['TRIAL', 'PLAYER_RECRUITMENT', 'REPRESENTATION', 'FOOTBALL_JOB']),
    description: text(5000),
    requirements: text(3000),
    location: text(150),
    applicationUrl: NetworkHttpsSchema,
    expiresAt: z
      .string()
      .datetime()
      .refine((s) => Date.parse(s) > Date.now(), 'Expiry must be in the future'),
    organisationId: text(100).optional(),
  })
  .strict();
export interface NetworkPage<T> {
  items: T[];
  page: number;
  limit: number;
  hasMore: boolean;
}
export interface NetworkProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  userType: string | null;
  headline: string | null;
  biography: string | null;
  expertise: string[];
  currentLocation: string | null;
  position: string | null;
  currentClub: string | null;
  profilePhoto: string | null;
  videos: string[];
  footballProfile: {
    primaryPosition: string | null;
    currentClub: string | null;
    previousClubs: string[];
    achievements: { id: string; title: string; description: string | null }[];
  } | null;
}
export interface NetworkOrganisation {
  id: string;
  name: string;
  type: string;
  description: string | null;
  location: string | null;
  website: string | null;
  ownerId: string;
  owner: NetworkProfile | null;
  members: NetworkProfile[];
  createdAt: string;
}
export interface NetworkConnection {
  id: string;
  requesterId: string;
  recipientId: string;
  status: string;
  createdAt: string;
  requester: NetworkProfile | null;
  recipient: NetworkProfile | null;
}
export interface NetworkMessage {
  id: string;
  connectionId: string;
  senderId: string;
  body: string;
  createdAt: string;
}
export interface NetworkPost {
  id: string;
  authorId: string;
  body: string;
  category: string;
  mediaUrl: string | null;
  createdAt: string;
  author: NetworkProfile | null;
}
export interface NetworkOpportunity {
  id: string;
  publisherId: string;
  organisationId: string | null;
  title: string;
  type: string;
  description: string;
  requirements: string;
  location: string;
  applicationUrl: string | null;
  expiresAt: string;
  status: string;
  createdAt: string;
  publisher: NetworkProfile | null;
  organisation: NetworkOrganisation | null;
  actionable: boolean;
}
export type NetworkProfileInput = z.infer<typeof NetworkProfileSchema>;
export type NetworkOrganisationInput = z.infer<typeof NetworkOrganisationSchema>;
export type NetworkPostInput = z.infer<typeof NetworkPostSchema>;
export type NetworkOpportunityInput = z.infer<typeof NetworkOpportunitySchema>;
