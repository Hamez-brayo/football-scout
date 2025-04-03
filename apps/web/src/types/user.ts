export enum UserType {
  TALENT = 'TALENT',
  AGENT = 'AGENT',
  CLUB = 'CLUB',
}

export enum RegistrationStatus {
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE',
  VERIFIED = 'VERIFIED',
}

export interface BaseUser {
  id: string;
  email: string;
  userType: UserType;
  registrationStatus: RegistrationStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Common types for structured data
export interface ContactDetails {
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
}

export interface MediaLink {
  type: 'video' | 'image';
  url: string;
  description?: string;
}

export interface PlayingHistory {
  club: string;
  startDate: Date;
  endDate?: Date;
  position: string;
  achievements?: string[];
}

export interface Achievement {
  title: string;
  date: Date;
  description: string;
  proof?: string; // URL to certificate/proof
}

export interface Reference {
  name: string;
  position: string;
  organization: string;
  contact: string;
  relationship: string;
} 