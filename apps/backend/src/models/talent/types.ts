import { BaseUser, PlayingHistory, Achievement } from '../user/types';

export interface TalentProfile {
  id: string;
  userId: string;
  user: BaseUser;

  // Basic Info
  fullName: string;
  dateOfBirth: Date;
  nationality: string;

  // Player Specifics
  positions: string[];
  currentClub?: string;
  height?: number;
  weight?: number;
  preferredFoot?: string;

  // Experience
  playingHistory?: PlayingHistory[];
  achievements?: Achievement[];

  // Media
  profilePhoto?: string;
  mediaLinks?: string[];

  createdAt: Date;
  updatedAt: Date;
}

export interface TalentRegistrationData {
  // Step 1: Basic Info
  fullName: string;
  dateOfBirth: string;
  nationality: string;

  // Step 2: Player Specifics
  positions: string[];
  currentClub?: string;
  height?: number;
  weight?: number;
  preferredFoot?: string;

  // Step 3: Experience (Optional at registration)
  playingHistory?: PlayingHistory[];
  achievements?: Achievement[];

  // Step 4: Media (Optional at registration)
  profilePhoto?: string;
} 