"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerViewSchema = exports.ScoutShortlistSchema = exports.SearchFiltersSchema = exports.PlayerStatsSchema = exports.PlayerStatCreateSchema = exports.MetricTypeSchema = exports.DrillSubmissionSchema = exports.DrillSchema = exports.TrainingProgramSchema = exports.MediaUploadSchema = exports.PlayerProfileSchema = exports.UpdateProfileSchema = exports.CreateProfileSchema = exports.AchievementSchema = exports.FootballProfileSchema = exports.PhysicalAttributesSchema = exports.UserProfileSchema = exports.SessionExchangeSchema = exports.SignInSchema = exports.SignUpSchema = exports.ApiPaginationSchema = exports.RoleSchema = void 0;
exports.validateData = validateData;
exports.validateDataSafe = validateDataSafe;
const zod_1 = require("zod");
exports.RoleSchema = zod_1.z.enum(['PLAYER', 'SCOUT']);
exports.ApiPaginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
exports.SignUpSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    firstName: zod_1.z.string().min(2).max(50),
    lastName: zod_1.z.string().min(2).max(50),
    role: exports.RoleSchema.optional(),
    // Backward compatibility for old client payloads.
    userType: exports.RoleSchema.optional(),
});
exports.SignInSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.SessionExchangeSchema = zod_1.z.object({
    idToken: zod_1.z.string().min(1),
    firstName: zod_1.z.string().min(2).max(50).optional(),
    lastName: zod_1.z.string().min(2).max(50).optional(),
    role: exports.RoleSchema.optional(),
    userType: exports.RoleSchema.optional(),
});
exports.UserProfileSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2).max(50).optional(),
    lastName: zod_1.z.string().min(2).max(50).optional(),
    fullName: zod_1.z.string().max(120).optional(),
    dateOfBirth: zod_1.z.string().datetime().optional(),
    nationality: zod_1.z.string().min(2).max(100).optional(),
    phone: zod_1.z.string().max(20).optional(),
    currentLocation: zod_1.z.string().max(200).optional(),
    profilePhoto: zod_1.z.string().url().optional(),
});
exports.PhysicalAttributesSchema = zod_1.z.object({
    heightCm: zod_1.z.number().min(100).max(250).optional(),
    weightKg: zod_1.z.number().min(30).max(200).optional(),
    wingspanCm: zod_1.z.number().min(100).max(300).optional(),
    sprintSpeed: zod_1.z.number().min(0).max(20).optional(),
    staminaScore: zod_1.z.number().min(0).max(100).optional(),
});
exports.FootballProfileSchema = zod_1.z.object({
    dominantFoot: zod_1.z.enum(['LEFT', 'RIGHT', 'BOTH']).optional(),
    playingStyle: zod_1.z.array(zod_1.z.string().max(80)).default([]),
    strongestSkills: zod_1.z.array(zod_1.z.string().max(80)).default([]),
    weakFootRating: zod_1.z.number().int().min(1).max(5).optional(),
});
exports.AchievementSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(200),
    description: zod_1.z.string().max(1000).optional(),
    date: zod_1.z.string().datetime().optional(),
});
exports.CreateProfileSchema = zod_1.z.object({
    primaryPosition: zod_1.z.string().max(50).optional(),
    secondaryPositions: zod_1.z.array(zod_1.z.string().max(50)).default([]),
    currentClub: zod_1.z.string().max(100).optional(),
    preferredFoot: zod_1.z.enum(['LEFT', 'RIGHT', 'BOTH']).optional(),
    experienceLevel: zod_1.z.enum(['AMATEUR', 'ACADEMY', 'SEMI_PRO', 'PRO']).optional(),
    isAvailable: zod_1.z.boolean().optional(),
    bio: zod_1.z.string().max(1000).optional(),
    physicalAttributes: exports.PhysicalAttributesSchema.optional(),
    footballProfile: exports.FootballProfileSchema.optional(),
});
exports.UpdateProfileSchema = exports.CreateProfileSchema.partial();
// Backward-compatible alias used by existing routes.
exports.PlayerProfileSchema = exports.CreateProfileSchema;
exports.MediaUploadSchema = zod_1.z.object({
    type: zod_1.z.enum(['IMAGE', 'VIDEO', 'image', 'video']).transform((value) => value.toUpperCase()),
    title: zod_1.z.string().max(200).optional(),
    description: zod_1.z.string().max(1000).optional(),
    mimeType: zod_1.z.string().min(3).max(120),
    sizeBytes: zod_1.z.number().int().positive(),
    durationSec: zod_1.z.number().int().positive().optional(),
});
exports.TrainingProgramSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(150),
    level: zod_1.z.string().min(2).max(50),
    positionFocus: zod_1.z.string().min(2).max(50),
    description: zod_1.z.string().max(1000).optional(),
});
exports.DrillSchema = zod_1.z.object({
    trainingProgramId: zod_1.z.string().min(1),
    title: zod_1.z.string().min(3).max(150),
    type: zod_1.z.enum(['TECHNICAL', 'ATHLETIC']),
    instructions: zod_1.z.string().min(10).max(5000),
    videoUrl: zod_1.z.string().url().optional(),
    displayOrder: zod_1.z.number().int().min(0).optional(),
});
exports.DrillSubmissionSchema = zod_1.z.object({
    drillId: zod_1.z.string().min(1),
    videoUrl: zod_1.z.string().url(),
});
exports.MetricTypeSchema = zod_1.z.object({
    key: zod_1.z.string().min(2).max(50),
    displayName: zod_1.z.string().min(2).max(100),
    unit: zod_1.z.string().max(30).optional(),
    description: zod_1.z.string().max(500).optional(),
});
exports.PlayerStatCreateSchema = zod_1.z.object({
    playerId: zod_1.z.string().min(1),
    metricKey: zod_1.z.string().min(2).max(50),
    value: zod_1.z.number(),
    recordedAt: zod_1.z.string().datetime().optional(),
    source: zod_1.z.string().max(100).optional(),
});
exports.PlayerStatsSchema = zod_1.z.object({
    metricKey: zod_1.z.string().min(2).max(50).optional(),
    from: zod_1.z.string().datetime().optional(),
    to: zod_1.z.string().datetime().optional(),
});
exports.SearchFiltersSchema = exports.ApiPaginationSchema.extend({
    query: zod_1.z.string().max(200).optional(),
    position: zod_1.z.string().max(50).optional(),
    nationality: zod_1.z.string().max(100).optional(),
    ageMin: zod_1.z.coerce.number().int().min(10).max(100).optional(),
    ageMax: zod_1.z.coerce.number().int().min(10).max(100).optional(),
    heightMin: zod_1.z.coerce.number().min(100).max(250).optional(),
    heightMax: zod_1.z.coerce.number().min(100).max(250).optional(),
    speedMin: zod_1.z.coerce.number().min(0).max(20).optional(),
    speedMax: zod_1.z.coerce.number().min(0).max(20).optional(),
    experienceLevel: zod_1.z.enum(['AMATEUR', 'ACADEMY', 'SEMI_PRO', 'PRO']).optional(),
    currentClub: zod_1.z.string().max(100).optional(),
});
exports.ScoutShortlistSchema = zod_1.z.object({
    playerId: zod_1.z.string().min(1),
    notes: zod_1.z.string().max(500).optional(),
});
exports.PlayerViewSchema = zod_1.z.object({
    playerId: zod_1.z.string().min(1),
});
function validateData(schema, data) {
    return schema.parse(data);
}
function validateDataSafe(schema, data) {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, errors: result.error };
}
