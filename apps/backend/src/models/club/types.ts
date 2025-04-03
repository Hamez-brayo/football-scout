import { BaseUser, ContactDetails } from '../user/types';

export interface ClubProfile {
  id: string;
  userId: string;
  user: BaseUser;

  // Basic Info
  clubName: string;
  location: string;
  league: string;
  country: string;

  // Official Details
  registrationNumber?: string;
  yearFounded?: number;
  website?: string;

  // Representative Info
  contactName: string;
  position: string;
  contactDetails: ContactDetails;

  // Verification
  officialDocs?: string;
  leagueAffiliation?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface ClubRegistrationData {
  // Step 1: Basic Info
  clubName: string;
  location: string;
  league: string;
  country: string;

  // Step 2: Official Details
  registrationNumber?: string;
  yearFounded?: number;
  website?: string;

  // Step 3: Representative Info
  contactName: string;
  position: string;
  contactDetails: ContactDetails;

  // Step 4: Verification (Optional at registration)
  officialDocs?: string;
  leagueAffiliation?: string;
} 