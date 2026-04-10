import { z } from 'zod';

export const RoleSchema = z.enum(['PLAYER', 'SCOUT']);

export const ApiPaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const SignUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  role: RoleSchema.optional(),
  // Backward compatibility for old client payloads.
  userType: RoleSchema.optional(),
});

export const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const SessionExchangeSchema = z.object({
  idToken: z.string().min(1),
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  role: RoleSchema.optional(),
  userType: RoleSchema.optional(),
});

export const UserProfileSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  fullName: z.string().max(120).optional(),
  dateOfBirth: z.string().datetime().optional(),
  nationality: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional(),
  currentLocation: z.string().max(200).optional(),
  profilePhoto: z.string().url().optional(),
});

export const PhysicalAttributesSchema = z.object({
  heightCm: z.number().min(100).max(250).optional(),
  weightKg: z.number().min(30).max(200).optional(),
  wingspanCm: z.number().min(100).max(300).optional(),
  sprintSpeed: z.number().min(0).max(20).optional(),
  staminaScore: z.number().min(0).max(100).optional(),
});

export const FootballProfileSchema = z.object({
  dominantFoot: z.enum(['LEFT', 'RIGHT', 'BOTH']).optional(),
  playingStyle: z.array(z.string().max(80)).default([]),
  strongestSkills: z.array(z.string().max(80)).default([]),
  weakFootRating: z.number().int().min(1).max(5).optional(),
});

export const AchievementSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  date: z.string().datetime().optional(),
});

export const CreateProfileSchema = z.object({
  primaryPosition: z.string().max(50).optional(),
  secondaryPositions: z.array(z.string().max(50)).default([]),
  currentClub: z.string().max(100).optional(),
  preferredFoot: z.enum(['LEFT', 'RIGHT', 'BOTH']).optional(),
  experienceLevel: z.enum(['AMATEUR', 'ACADEMY', 'SEMI_PRO', 'PRO']).optional(),
  isAvailable: z.boolean().optional(),
  bio: z.string().max(1000).optional(),
  physicalAttributes: PhysicalAttributesSchema.optional(),
  footballProfile: FootballProfileSchema.optional(),
});

export const UpdateProfileSchema = CreateProfileSchema.partial();

// Backward-compatible alias used by existing routes.
export const PlayerProfileSchema = CreateProfileSchema;

export const MediaUploadSchema = z.object({
  type: z.enum(['IMAGE', 'VIDEO', 'image', 'video']).transform((value) => value.toUpperCase() as 'IMAGE' | 'VIDEO'),
  title: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  mimeType: z.string().min(3).max(120),
  sizeBytes: z.number().int().positive(),
  durationSec: z.number().int().positive().optional(),
});

export const TrainingProgramSchema = z.object({
  title: z.string().min(3).max(150),
  level: z.string().min(2).max(50),
  positionFocus: z.string().min(2).max(50),
  description: z.string().max(1000).optional(),
});

export const DrillSchema = z.object({
  trainingProgramId: z.string().min(1),
  title: z.string().min(3).max(150),
  type: z.enum(['TECHNICAL', 'ATHLETIC']),
  instructions: z.string().min(10).max(5000),
  videoUrl: z.string().url().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const DrillSubmissionSchema = z.object({
  drillId: z.string().min(1),
  videoUrl: z.string().url(),
});

export const MetricTypeSchema = z.object({
  key: z.string().min(2).max(50),
  displayName: z.string().min(2).max(100),
  unit: z.string().max(30).optional(),
  description: z.string().max(500).optional(),
});

export const PlayerStatCreateSchema = z.object({
  playerId: z.string().min(1),
  metricKey: z.string().min(2).max(50),
  value: z.number(),
  recordedAt: z.string().datetime().optional(),
  source: z.string().max(100).optional(),
});

export const PlayerStatsSchema = z.object({
  metricKey: z.string().min(2).max(50).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const SearchFiltersSchema = ApiPaginationSchema.extend({
  query: z.string().max(200).optional(),
  position: z.string().max(50).optional(),
  nationality: z.string().max(100).optional(),
  ageMin: z.coerce.number().int().min(10).max(100).optional(),
  ageMax: z.coerce.number().int().min(10).max(100).optional(),
  heightMin: z.coerce.number().min(100).max(250).optional(),
  heightMax: z.coerce.number().min(100).max(250).optional(),
  speedMin: z.coerce.number().min(0).max(20).optional(),
  speedMax: z.coerce.number().min(0).max(20).optional(),
  experienceLevel: z.enum(['AMATEUR', 'ACADEMY', 'SEMI_PRO', 'PRO']).optional(),
  currentClub: z.string().max(100).optional(),
});

export const ScoutShortlistSchema = z.object({
  playerId: z.string().min(1),
  notes: z.string().max(500).optional(),
});

export const PlayerViewSchema = z.object({
  playerId: z.string().min(1),
});

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
