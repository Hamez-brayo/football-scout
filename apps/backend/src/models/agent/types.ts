import { BaseUser, Reference } from '../user/types';

export interface AgentProfile {
  id: string;
  userId: string;
  user: BaseUser;

  // Basic Info
  fullName: string;
  companyName?: string;
  licenseNumber?: string;

  // Professional Details
  yearsExperience?: number;
  operationAreas: string[];
  languages: string[];

  // Verification
  licenseDoc?: string;
  references?: Reference[];
  businessRegDoc?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface AgentRegistrationData {
  // Step 1: Basic Info
  fullName: string;
  companyName?: string;
  licenseNumber?: string;

  // Step 2: Professional Details
  yearsExperience?: number;
  operationAreas: string[];
  languages: string[];

  // Step 3: Verification (Optional at registration)
  licenseDoc?: string;
  references?: Reference[];
  businessRegDoc?: string;
} 