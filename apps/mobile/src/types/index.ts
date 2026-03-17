/**
 * Core Types — Re-export from shared package
 *
 * All domain types live in @vysion/shared. Import from here
 * so the mobile app has a single import path for types.
 */
export type {
  UserProfile,
  PlayerProfile,
  PhysicalAttributes,
  FootballProfile,
  Achievement,
  Media,
  AuthUser,
  AuthTokens,
  SearchFilters,
  PaginatedResponse,
  ApiResponse,
  ApiError,
  VerificationRequest,
  Message,
  Conversation,
} from '@vysion/shared';

export {
  UserType,
  RegistrationStatus,
  PlayingStatus,
  ExperienceLevel,
  PreferredFoot,
  ProfessionalFocus,
  Position,
  VerificationStatus,
} from '@vysion/shared';
