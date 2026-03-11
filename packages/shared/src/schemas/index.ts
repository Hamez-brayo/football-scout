import { z } from 'zod';

/**
 * User Schemas
 */

export const UserProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  nickname: z.string().max(50).optional(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional(),
  languages: z.array(z.string()).default([]),
  currentLocation: z.string().max(200).optional(),
  profilePhoto: z.string().url().optional(),
  coverPhoto: z.string().url().optional(),
});

export const PhysicalAttributesSchema = z.object({
  height: z.number().min(100).max(250).optional(), // in cm
  weight: z.number().min(30).max(200).optional(), // in kg
  wingspan: z.number().min(100).max(300).optional(), // in cm
  fitnessLevel: z.number().min(0).max(100).default(0),
  preferredFoot: z.enum(['LEFT', 'RIGHT', 'BOTH']).optional(),
});

export const FootballProfileSchema = z.object({
  primaryPosition: z.string().max(50).optional(),
  secondaryPositions: z.array(z.string()).default([]),
  currentClub: z.string().max(100).optional(),
  previousClubs: z.array(z.string()).default([]),
  playingStyle: z.array(z.string()).default([]),
  strongFoot: z.enum(['LEFT', 'RIGHT', 'BOTH']).optional(),
  experience: z.enum(['AMATEUR', 'ACADEMY', 'SEMI_PRO', 'PRO']).optional(),
});

/**
 * Player Profile Schema (for scout discovery)
 */
export const PlayerProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  age: z.number().min(10).max(100).optional(),
  nationality: z.string().max(100).optional(),
  position: z.string().max(50).optional(),
  preferredFoot: z.enum(['LEFT', 'RIGHT', 'BOTH']).optional(),
  height: z.number().min(100).max(250).optional(), // in cm
  weight: z.number().min(30).max(200).optional(), // in kg
  speed: z.number().min(0).max(100).optional(), // 0-100 rating
  stamina: z.number().min(0).max(100).optional(), // 0-100 rating
  currentClub: z.string().max(100).optional(),
  profilePhoto: z.string().url().optional(),
});

export const AchievementSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  date: z.string().datetime().optional(),
});

/**
 * Media Schemas
 */

export const MediaUploadSchema = z.object({
  type: z.enum(['image', 'video']),
  title: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
});

/**
 * Authentication Schemas
 */

export const SignUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  userType: z.enum(['TALENT', 'SCOUT', 'AGENT', 'CLUB']).optional(),
});

export const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Search Schemas
 */

export const SearchFiltersSchema = z.object({
  query: z.string().max(200).optional(),
  position: z.string().optional(),
  nationality: z.string().max(100).optional(),
  ageMin: z.number().min(10).max(100).optional(),
  ageMax: z.number().min(10).max(100).optional(),
  heightMin: z.number().min(100).max(250).optional(), // in cm
  heightMax: z.number().min(100).max(250).optional(), // in cm
  speedMin: z.number().min(0).max(100).optional(), // 0-100 rating
  speedMax: z.number().min(0).max(100).optional(), // 0-100 rating
  experienceLevel: z.enum(['AMATEUR', 'ACADEMY', 'SEMI_PRO', 'PRO']).optional(),
  currentClub: z.string().max(100).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

/**
 * Verification Schemas
 */

export const VerificationRequestSchema = z.object({
  type: z.enum(['face', 'skill', 'document']),
  mediaUrls: z.array(z.string().url()).min(1),
  notes: z.string().max(1000).optional(),
});

/**
 * Messaging Schemas
 */

export const MessageSchema = z.object({
  receiverId: z.string().min(1),
  content: z.string().min(1).max(5000),
});

/**
 * Helper function to validate data
 */

export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

export function validateDataSafe<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}
