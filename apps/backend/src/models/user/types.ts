export enum UserType {
  TALENT = 'TALENT',
  AGENT = 'AGENT',
  CLUB = 'CLUB'
}

export interface BaseUser {
  userId: string;
  email: string;
  fullName: string;
  userType: UserType;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  profilePhoto?: string;
  coverPhoto?: string;
  dateOfBirth?: string;
  nationality?: string;
  languages?: string[];
  currentLocation?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Types for structured JSON data
export interface PlayingHistory {
  team: string;
  from: string;
  to: string;
  level: string;
}

export interface Achievement {
  title: string;
  description: string;
  date: string;
}

export interface ContactDetails {
  phone: string;
  email: string;
  alternatePhone?: string;
}

export interface Reference {
  name: string;
  position: string;
  organization: string;
  contact: string;
} 