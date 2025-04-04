import { z } from 'zod';

// Basic Info Schema
export const basicInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  dateOfBirth: z.string().refine(
    (date) => {
      const today = new Date();
      const birthDate = new Date(date);
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 12 && age <= 50;
    },
    { message: 'Age must be between 12 and 50 years' }
  ),
  nationality: z.string().min(2, 'Nationality is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().min(2, 'Country is required'),
    postalCode: z.string().optional(),
  }),
});

// Football Profile Schema
export const footballProfileSchema = z.object({
  currentClub: z.string().optional(),
  position: z.string().min(2, 'Position is required'),
  secondaryPositions: z.array(z.string()).optional(),
  height: z.number().min(100, 'Height must be at least 100 cm').max(250, 'Height must be at most 250 cm'),
  weight: z.number().min(30, 'Weight must be at least 30 kg').max(150, 'Weight must be at most 150 kg'),
  preferredFoot: z.enum(['left', 'right', 'both']),
  playingStyle: z.string().optional(),
  experienceLevel: z.enum(['amateur', 'semi-professional', 'professional', 'youth']),
});

// Achievements Schema
export const achievementsSchema = z.object({
  titles: z.array(z.string()).optional(),
  awards: z.array(z.string()).optional(),
  careerHighlights: z.array(z.string()).optional(),
  statistics: z.array(z.object({
    season: z.string(),
    goals: z.number().optional(),
    assists: z.number().optional(),
    appearances: z.number().optional(),
    cleanSheets: z.number().optional(),
  })).optional(),
});

// Media Profile Schema
export const mediaProfileSchema = z.object({
  profilePhoto: z.string().min(1, 'Profile photo is required'),
  highlightVideo: z.string().url('Invalid video URL').optional(),
  matchFootage: z.array(z.string().url('Invalid video URL')).optional(),
  certificates: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
  socialMedia: z.object({
    instagram: z.string().url('Invalid Instagram URL').optional(),
    twitter: z.string().url('Invalid Twitter URL').optional(),
    youtube: z.string().url('Invalid YouTube URL').optional(),
  }).optional(),
  additionalInfo: z.string().optional(),
});

// Complete Talent Registration Schema
export const talentRegistrationSchema = z.object({
  userType: z.literal('TALENT'),
  basicInfo: basicInfoSchema,
  footballProfile: footballProfileSchema,
  achievements: achievementsSchema.optional(),
  media: mediaProfileSchema,
  preferences: z.object({
    visibility: z.enum(['public', 'private', 'verified-only']),
    contactPreference: z.enum(['email', 'phone', 'both']),
    notificationSettings: z.object({
      email: z.boolean(),
      push: z.boolean(),
      sms: z.boolean(),
    }),
  }).optional(),
});

// Helper function to validate a specific step
export const validateStep = async (stepId: string, data: any) => {
  try {
    switch (stepId) {
      case 'basic-info':
        await basicInfoSchema.parseAsync(data);
        break;
      case 'playing-info':
        await footballProfileSchema.parseAsync(data);
        break;
      case 'achievements':
        await achievementsSchema.parseAsync(data);
        break;
      case 'media':
        await mediaProfileSchema.parseAsync(data);
        break;
      default:
        throw new Error('Invalid step ID');
    }
    return { success: true, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.reduce((acc, err) => {
        const path = err.path.join('.');
        return { ...acc, [path]: err.message };
      }, {});
      return { success: false, errors: formattedErrors };
    }
    throw error;
  }
}; 