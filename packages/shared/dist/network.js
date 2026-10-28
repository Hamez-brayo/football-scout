"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkOpportunitySchema = exports.NetworkPostSchema = exports.NetworkOrganisationSchema = exports.NetworkProfileSchema = exports.NetworkPaginationSchema = exports.NetworkHttpsSchema = void 0;
const zod_1 = require("zod");
const text = (max) => zod_1.z.string().trim().min(1).max(max);
exports.NetworkHttpsSchema = zod_1.z
    .string()
    .url()
    .max(2048)
    .refine((value) => {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
}, 'Use an HTTPS URL without credentials');
exports.NetworkPaginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).max(10000).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
exports.NetworkProfileSchema = zod_1.z
    .object({
    firstName: text(50).optional(),
    lastName: text(50).optional(),
    headline: text(160).nullable().optional(),
    biography: text(3000).nullable().optional(),
    expertise: zod_1.z.array(text(80)).max(20).optional(),
    currentLocation: text(120).nullable().optional(),
    position: text(80).nullable().optional(),
    currentClub: text(120).nullable().optional(),
    videos: zod_1.z.array(exports.NetworkHttpsSchema).max(20).optional(),
    profilePhoto: exports.NetworkHttpsSchema.nullable().optional(),
    userType: zod_1.z.enum(['TALENT', 'SCOUT', 'COACH', 'AGENT', 'CLUB']).optional(),
    football: zod_1.z
        .object({
        primaryPosition: text(80).optional(),
        currentClub: text(120).optional(),
        previousClubs: zod_1.z.array(text(120)).max(30).optional(),
        achievements: zod_1.z
            .array(zod_1.z.object({ title: text(150), description: text(1000).optional() }).strict())
            .max(30)
            .optional(),
    })
        .strict()
        .optional(),
})
    .strict();
exports.NetworkOrganisationSchema = zod_1.z
    .object({
    name: text(150),
    type: zod_1.z.enum(['CLUB', 'AGENCY']),
    description: text(3000).nullable().optional(),
    location: text(150).nullable().optional(),
    website: exports.NetworkHttpsSchema.nullable().optional(),
})
    .strict();
exports.NetworkPostSchema = zod_1.z
    .object({
    body: text(3000),
    category: zod_1.z.enum(['MATCH_FOOTAGE', 'TRAINING', 'ACHIEVEMENT', 'TEAM_UPDATE', 'RECRUITMENT']),
    mediaUrl: exports.NetworkHttpsSchema.optional(),
})
    .strict();
exports.NetworkOpportunitySchema = zod_1.z
    .object({
    title: text(150),
    type: zod_1.z.enum(['TRIAL', 'PLAYER_RECRUITMENT', 'REPRESENTATION', 'FOOTBALL_JOB']),
    description: text(5000),
    requirements: text(3000),
    location: text(150),
    applicationUrl: exports.NetworkHttpsSchema,
    expiresAt: zod_1.z
        .string()
        .datetime()
        .refine((s) => Date.parse(s) > Date.now(), 'Expiry must be in the future'),
    organisationId: text(100).optional(),
})
    .strict();
