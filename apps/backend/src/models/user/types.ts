export enum UserType {
  TALENT = 'TALENT',
  AGENT = 'AGENT',
  CLUB = 'CLUB'
}

export enum RegistrationStatus {
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE',
  VERIFIED = 'VERIFIED'
}

export interface BaseUser {
  id: string;
  email: string;
  userType: UserType;
  registrationStatus: RegistrationStatus;
  createdAt: Date;
  updatedAt: Date;
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