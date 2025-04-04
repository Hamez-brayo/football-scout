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

export interface FootballProfile {
  position: string;
  strongFoot: 'LEFT' | 'RIGHT' | 'BOTH';
  height: number;
  weight: number;
  currentClub?: string;
}

export interface Experience {
  clubName: string;
  role: string;
  startDate: string;
  endDate?: string;
  achievements?: string[];
}

export interface Achievement {
  title: string;
  date: string;
  description: string;
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