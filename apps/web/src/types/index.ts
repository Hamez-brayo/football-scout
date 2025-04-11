export type UserType = 'TALENT' | 'AGENT' | 'CLUB';

export interface RegistrationStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  isVisible: boolean;
}

export interface BasicInfo {
  name: string;
  email: string;
  dateOfBirth: string;
  nationality: string;
  phone?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  profilePhoto?: string;
  coverPhoto?: string;
  dateOfBirth: string;
  nationality: string;
  languages: string[];
  currentLocation: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PhysicalAttributes {
  userId: string;
  height: number; // in cm
  weight: number; // in kg
  preferredFoot: 'left' | 'right' | 'both';
  fitnessLevel: number; // 0-100
  updatedAt: string;
}

export interface FootballProfile {
  userId: string;
  primaryPosition: string;
  secondaryPositions: string[];
  currentClub?: string;
  previousClubs: string[];
  playingStyle: string[];
  updatedAt: string;
}

export interface Availability {
  userId: string;
  isAvailableForTrials: boolean;
  preferredRegions: string[];
  willingToRelocate: boolean;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  userId: string;
  type: 'video' | 'photo';
  url: string;
  thumbnailUrl?: string;
  title: string;
  description?: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  type: 'trophy' | 'certification' | 'performance';
  createdAt: string;
}

export interface SocialLinks {
  userId: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  tiktok?: string;
  updatedAt: string;
}

export interface PrivacySettings {
  userId: string;
  profileVisibility: 'public' | 'scout-only' | 'private';
  showContactInfo: boolean;
  showLocation: boolean;
  showAchievements: boolean;
  showMedia: boolean;
  updatedAt: string;
}

export interface Experience {
  clubName: string;
  role: string;
  startDate: string;
  endDate?: string;
  achievements?: string[];
}

export interface Media {
  type: 'VIDEO' | 'IMAGE';
  url: string;
  description?: string;
}

export interface TalentRegistrationData {
  userType: UserType;
  basicInfo?: BasicInfo;
  footballProfile?: FootballProfile;
  experience?: Experience[];
  achievements?: Achievement[];
  media?: Media[];
}

export interface FormErrors {
  [key: string]: string[];
}

export interface RegistrationContextType {
  userType?: UserType;
  setUserType: (type: UserType) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  registrationData: Partial<TalentRegistrationData>;
  updateRegistrationData: (data: Partial<TalentRegistrationData>) => void;
  errors: FormErrors;
  setErrors: (errors: FormErrors) => void;
  clearErrors: () => void;
  isStepComplete: (stepId: string) => boolean;
  markStepComplete: (stepId: string) => void;
  progress: number;
  nextStep: () => void;
  previousStep: () => void;
  isFirstStep: () => boolean;
  isLastStep: () => boolean;
  visibleSteps: RegistrationStep[];
} 