import { z } from 'zod';
import { ExperienceLevel } from './types';
export declare const NetworkHttpsSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const NetworkPaginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
}, {
    page?: number | undefined;
    limit?: number | undefined;
}>;
export declare const NetworkOpportunityQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
} & {
    organisationId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    organisationId?: string | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    organisationId?: string | undefined;
}>;
export declare const NetworkProfileSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    headline: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    biography: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    expertise: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    currentLocation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    position: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    currentClub: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    videos: z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodString, string, string>, "many">>;
    profilePhoto: z.ZodOptional<z.ZodNullable<z.ZodEffects<z.ZodString, string, string>>>;
    userType: z.ZodOptional<z.ZodEnum<["TALENT", "SCOUT", "COACH", "AGENT", "CLUB"]>>;
    football: z.ZodOptional<z.ZodObject<{
        primaryPosition: z.ZodOptional<z.ZodString>;
        currentClub: z.ZodOptional<z.ZodString>;
        experience: z.ZodOptional<z.ZodNullable<z.ZodNativeEnum<typeof ExperienceLevel>>>;
        previousClubs: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        achievements: z.ZodOptional<z.ZodArray<z.ZodObject<{
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            title: string;
            description?: string | undefined;
        }, {
            title: string;
            description?: string | undefined;
        }>, "many">>;
    }, "strict", z.ZodTypeAny, {
        primaryPosition?: string | undefined;
        currentClub?: string | undefined;
        previousClubs?: string[] | undefined;
        experience?: ExperienceLevel | null | undefined;
        achievements?: {
            title: string;
            description?: string | undefined;
        }[] | undefined;
    }, {
        primaryPosition?: string | undefined;
        currentClub?: string | undefined;
        previousClubs?: string[] | undefined;
        experience?: ExperienceLevel | null | undefined;
        achievements?: {
            title: string;
            description?: string | undefined;
        }[] | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    currentLocation?: string | null | undefined;
    profilePhoto?: string | null | undefined;
    currentClub?: string | null | undefined;
    position?: string | null | undefined;
    userType?: "TALENT" | "COACH" | "SCOUT" | "AGENT" | "CLUB" | undefined;
    headline?: string | null | undefined;
    biography?: string | null | undefined;
    expertise?: string[] | undefined;
    videos?: string[] | undefined;
    football?: {
        primaryPosition?: string | undefined;
        currentClub?: string | undefined;
        previousClubs?: string[] | undefined;
        experience?: ExperienceLevel | null | undefined;
        achievements?: {
            title: string;
            description?: string | undefined;
        }[] | undefined;
    } | undefined;
}, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    currentLocation?: string | null | undefined;
    profilePhoto?: string | null | undefined;
    currentClub?: string | null | undefined;
    position?: string | null | undefined;
    userType?: "TALENT" | "COACH" | "SCOUT" | "AGENT" | "CLUB" | undefined;
    headline?: string | null | undefined;
    biography?: string | null | undefined;
    expertise?: string[] | undefined;
    videos?: string[] | undefined;
    football?: {
        primaryPosition?: string | undefined;
        currentClub?: string | undefined;
        previousClubs?: string[] | undefined;
        experience?: ExperienceLevel | null | undefined;
        achievements?: {
            title: string;
            description?: string | undefined;
        }[] | undefined;
    } | undefined;
}>;
export declare const NetworkOrganisationSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["CLUB", "AGENCY"]>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    location: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    website: z.ZodOptional<z.ZodNullable<z.ZodEffects<z.ZodString, string, string>>>;
}, "strict", z.ZodTypeAny, {
    type: "CLUB" | "AGENCY";
    name: string;
    description?: string | null | undefined;
    location?: string | null | undefined;
    website?: string | null | undefined;
}, {
    type: "CLUB" | "AGENCY";
    name: string;
    description?: string | null | undefined;
    location?: string | null | undefined;
    website?: string | null | undefined;
}>;
export declare const NetworkPostSchema: z.ZodObject<{
    body: z.ZodString;
    category: z.ZodEnum<["MATCH_FOOTAGE", "TRAINING", "ACHIEVEMENT", "TEAM_UPDATE", "RECRUITMENT"]>;
    mediaUrl: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
}, "strict", z.ZodTypeAny, {
    body: string;
    category: "MATCH_FOOTAGE" | "TRAINING" | "ACHIEVEMENT" | "TEAM_UPDATE" | "RECRUITMENT";
    mediaUrl?: string | undefined;
}, {
    body: string;
    category: "MATCH_FOOTAGE" | "TRAINING" | "ACHIEVEMENT" | "TEAM_UPDATE" | "RECRUITMENT";
    mediaUrl?: string | undefined;
}>;
export declare const NetworkOpportunitySchema: z.ZodObject<{
    title: z.ZodString;
    type: z.ZodEnum<["TRIAL", "PLAYER_RECRUITMENT", "REPRESENTATION", "FOOTBALL_JOB"]>;
    description: z.ZodString;
    requirements: z.ZodString;
    location: z.ZodString;
    applicationUrl: z.ZodEffects<z.ZodString, string, string>;
    expiresAt: z.ZodEffects<z.ZodString, string, string>;
    organisationId: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    type: "TRIAL" | "PLAYER_RECRUITMENT" | "REPRESENTATION" | "FOOTBALL_JOB";
    title: string;
    description: string;
    location: string;
    requirements: string;
    applicationUrl: string;
    expiresAt: string;
    organisationId?: string | undefined;
}, {
    type: "TRIAL" | "PLAYER_RECRUITMENT" | "REPRESENTATION" | "FOOTBALL_JOB";
    title: string;
    description: string;
    location: string;
    requirements: string;
    applicationUrl: string;
    expiresAt: string;
    organisationId?: string | undefined;
}>;
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
        experience: ExperienceLevel | null;
        previousClubs: string[];
        achievements: {
            id: string;
            title: string;
            description: string | null;
        }[];
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
