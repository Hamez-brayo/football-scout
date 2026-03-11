"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSchema = exports.VerificationRequestSchema = exports.SearchFiltersSchema = exports.SignInSchema = exports.SignUpSchema = exports.MediaUploadSchema = exports.AchievementSchema = exports.FootballProfileSchema = exports.PhysicalAttributesSchema = exports.UserProfileSchema = void 0;
exports.validateData = validateData;
exports.validateDataSafe = validateDataSafe;
const zod_1 = require("zod");
/**
 * User Schemas
 */
exports.UserProfileSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2, 'First name must be at least 2 characters').max(50),
    lastName: zod_1.z.string().min(2, 'Last name must be at least 2 characters').max(50),
    nickname: zod_1.z.string().max(50).optional(),
    dateOfBirth: zod_1.z.string().optional(),
    nationality: zod_1.z.string().min(2).max(100).optional(),
    phone: zod_1.z.string().max(20).optional(),
    languages: zod_1.z.array(zod_1.z.string()).default([]),
    currentLocation: zod_1.z.string().max(200).optional(),
    profilePhoto: zod_1.z.string().url().optional(),
    coverPhoto: zod_1.z.string().url().optional(),
});
exports.PhysicalAttributesSchema = zod_1.z.object({
    height: zod_1.z.number().min(100).max(250).optional(), // in cm
    weight: zod_1.z.number().min(30).max(200).optional(), // in kg
    wingspan: zod_1.z.number().min(100).max(300).optional(), // in cm
    fitnessLevel: zod_1.z.number().min(0).max(100).default(0),
    preferredFoot: zod_1.z.enum(['LEFT', 'RIGHT', 'BOTH']).optional(),
});
exports.FootballProfileSchema = zod_1.z.object({
    primaryPosition: zod_1.z.string().max(50).optional(),
    secondaryPositions: zod_1.z.array(zod_1.z.string()).default([]),
    currentClub: zod_1.z.string().max(100).optional(),
    previousClubs: zod_1.z.array(zod_1.z.string()).default([]),
    playingStyle: zod_1.z.array(zod_1.z.string()).default([]),
    strongFoot: zod_1.z.enum(['LEFT', 'RIGHT', 'BOTH']).optional(),
    experience: zod_1.z.enum(['AMATEUR', 'ACADEMY', 'SEMI_PRO', 'PRO']).optional(),
});
exports.AchievementSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(200),
    description: zod_1.z.string().max(1000).optional(),
    date: zod_1.z.string().datetime().optional(),
});
/**
 * Media Schemas
 */
exports.MediaUploadSchema = zod_1.z.object({
    type: zod_1.z.enum(['image', 'video']),
    title: zod_1.z.string().max(200).optional(),
    description: zod_1.z.string().max(1000).optional(),
});
/**
 * Authentication Schemas
 */
exports.SignUpSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    firstName: zod_1.z.string().min(2).max(50),
    lastName: zod_1.z.string().min(2).max(50),
    userType: zod_1.z.enum(['TALENT', 'SCOUT', 'AGENT', 'CLUB']).optional(),
});
exports.SignInSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
/**
 * Search Schemas
 */
exports.SearchFiltersSchema = zod_1.z.object({
    query: zod_1.z.string().max(200).optional(),
    position: zod_1.z.string().optional(),
    nationality: zod_1.z.string().max(100).optional(),
    ageMin: zod_1.z.number().min(10).max(100).optional(),
    ageMax: zod_1.z.number().min(10).max(100).optional(),
    experienceLevel: zod_1.z.enum(['AMATEUR', 'ACADEMY', 'SEMI_PRO', 'PRO']).optional(),
    currentClub: zod_1.z.string().max(100).optional(),
    page: zod_1.z.number().min(1).default(1),
    limit: zod_1.z.number().min(1).max(100).default(20),
});
/**
 * Verification Schemas
 */
exports.VerificationRequestSchema = zod_1.z.object({
    type: zod_1.z.enum(['face', 'skill', 'document']),
    mediaUrls: zod_1.z.array(zod_1.z.string().url()).min(1),
    notes: zod_1.z.string().max(1000).optional(),
});
/**
 * Messaging Schemas
 */
exports.MessageSchema = zod_1.z.object({
    receiverId: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1).max(5000),
});
/**
 * Helper function to validate data
 */
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
