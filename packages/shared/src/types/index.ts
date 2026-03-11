/**
 * User Types and Interfaces
 */

export enum UserType {
  TALENT = 'TALENT',
  SCOUT = 'SCOUT',
  AGENT = 'AGENT',
  CLUB = 'CLUB',
}

export enum RegistrationStatus {
  INCOMPLETE = 'INCOMPLETE',
  JOURNEY_COMPLETED = 'JOURNEY_COMPLETED',
  COMPLETE = 'COMPLETE',
}

export enum PlayingStatus {
  PLAYING = 'PLAYING',
  PROFESSIONAL = 'PROFESSIONAL',
}

export enum ExperienceLevel {
  AMATEUR = 'AMATEUR',
  ACADEMY = 'ACADEMY',
  SEMI_PRO = 'SEMI_PRO',
  PRO = 'PRO',
}

export enum PreferredFoot {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  BOTH = 'BOTH',
}

export enum ProfessionalFocus {
  PLAYER_DEVELOPMENT = 'PLAYER_DEVELOPMENT',
  TEAM_OPERATIONS = 'TEAM_OPERATIONS',
  TALENT_DISCOVERY = 'TALENT_DISCOVERY',
  CLUB_MANAGEMENT = 'CLUB_MANAGEMENT',
}

export enum Position {
  GOALKEEPER = 'GOALKEEPER',
  CENTER_BACK = 'CENTER_BACK',
  LEFT_BACK = 'LEFT_BACK',
  RIGHT_BACK = 'RIGHT_BACK',
  DEFENSIVE_MIDFIELDER = 'DEFENSIVE_MIDFIELDER',
  CENTRAL_MIDFIELDER = 'CENTRAL_MIDFIELDER',
  ATTACKING_MIDFIELDER = 'ATTACKING_MIDFIELDER',
  LEFT_WINGER = 'LEFT_WINGER',
  RIGHT_WINGER = 'RIGHT_WINGER',
  STRIKER = 'STRIKER',
  FORWARD = 'FORWARD',
}

export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  nickname?: string;
  dateOfBirth?: string;
  nationality?: string;
  phone?: string;
  languages: string[];
  currentLocation?: string;
  profilePhoto?: string;
  coverPhoto?: string;
  registrationStatus: RegistrationStatus;
  userType?: UserType;
  createdAt: Date;
  updatedAt: Date;
}

export interface PhysicalAttributes {
  id: string;
  userId: string;
  height?: number;
  weight?: number;
  wingspan?: number;
  fitnessLevel: number;
  preferredFoot?: PreferredFoot;
  createdAt: Date;
  updatedAt: Date;
}

export interface FootballProfile {
  id: string;
  userId: string;
  primaryPosition?: string;
  secondaryPositions: string[];
  currentClub?: string;
  previousClubs: string[];
  playingStyle: string[];
  strongFoot?: PreferredFoot;
  experience?: ExperienceLevel;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  footballProfileId: string;
  title: string;
  description?: string;
  date?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Media {
  id: string;
  userId: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * API Response Types
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
  timestamp: string;
}

/**
 * Authentication Types
 */

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

/**
 * Search and Filter Types
 */

export interface SearchFilters {
  query?: string;
  position?: Position;
  nationality?: string;
  ageMin?: number;
  ageMax?: number;
  experienceLevel?: ExperienceLevel;
  currentClub?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Verification Types
 */

export enum VerificationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export interface VerificationRequest {
  id: string;
  userId: string;
  type: 'face' | 'skill' | 'document';
  status: VerificationStatus;
  mediaUrls: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Messaging Types
 */

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  updatedAt: Date;
}
