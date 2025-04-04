// User Types
export type UserType = 'talent' | 'organization';

// Basic Information
export interface BasicInfo {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country: string;
    postalCode?: string;
  };
}

// Talent-specific types
export interface FootballProfile {
  currentClub?: string;
  position: string;
  secondaryPositions?: string[];
  height: number;
  weight: number;
  preferredFoot: 'left' | 'right' | 'both';
  playingStyle?: string;
  experienceLevel: 'amateur' | 'semi-professional' | 'professional' | 'youth';
}

export interface TalentAchievements {
  titles?: string[];
  awards?: string[];
  careerHighlights?: string[];
  statistics?: {
    season: string;
    goals?: number;
    assists?: number;
    appearances?: number;
    cleanSheets?: number;
    [key: string]: any;
  }[];
}

export interface MediaProfile {
  profilePhoto: string;
  highlightVideo?: string;
  matchFootage?: string[];
  certificates?: string[];
  documents?: string[];
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    [key: string]: string | undefined;
  };
  additionalInfo?: string;
}

// Registration Step
export interface RegistrationStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  isVisible: boolean;
  component?: React.ComponentType;
  validationSchema?: any;
}

// Form Data
export interface TalentRegistrationData {
  userType: 'TALENT';
  basicInfo: BasicInfo;
  footballProfile: FootballProfile;
  achievements?: TalentAchievements;
  media: MediaProfile;
  preferences?: {
    visibility: 'public' | 'private' | 'verified-only';
    contactPreference: 'email' | 'phone' | 'both';
    notificationSettings: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
}

// Form Validation Errors
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string | FormErrors;
}

// Registration Context
export interface RegistrationContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  registrationData: Partial<TalentRegistrationData>;
  updateRegistrationData: (data: Partial<TalentRegistrationData>) => void;
  visibleSteps: RegistrationStep[];
  userType: UserType | undefined;
  setUserType: (type: UserType) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  isStepComplete: (stepId: string) => boolean;
  markStepComplete: (stepId: string) => void;
  currentStepData: RegistrationStep | undefined;
  totalSteps: number;
  progress: number;
  errors: FormErrors;
  setErrors: (errors: FormErrors) => void;
  clearErrors: () => void;
  validateStep: (stepId: string) => Promise<boolean>;
}

// Form Props
export interface BaseFormProps {
  children: React.ReactNode;
  onSubmit: (data: any) => Promise<void>;
  isValid?: boolean;
  showNavigation?: boolean;
}

export interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export interface FormSelectProps extends Omit<FormInputProps, 'type' | 'value' | 'onChange'> {
  options: { value: string; label: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface FormTextAreaProps extends Omit<FormInputProps, 'type'> {
  rows?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export type UserPath = 'player' | 'agent' | 'club';

export type PlayingStatus = 'currently_playing' | 'professional_role';

export type PlayingLevel = 'amateur' | 'academy' | 'semi_pro' | 'pro';

export type ProfessionalFocus = 'player_development' | 'team_operations' | 'talent_discovery' | 'club_management';

export interface RegistrationData {
  // Step 1: Universal Information
  basicInfo?: {
    fullName: string;
    email: string;
    dateOfBirth: string;
  };
  
  // Step 2: Football Journey
  journey?: {
    status: PlayingStatus;
    level?: PlayingLevel;
    focus?: ProfessionalFocus;
  };
  
  // Step 3: Path-specific Information
  path?: UserPath;
  pathData?: {
    player?: {
      position?: string;
      currentClub?: string;
      preferredFoot?: 'left' | 'right' | 'both';
    };
    agent?: {
      agencyName?: string;
      yearsOfExperience?: number;
      specialties?: string[];
    };
    club?: {
      clubName?: string;
      role?: string;
      department?: string;
    };
  };
  
  // Media
  media?: {
    profilePicture?: string;
    coverPhoto?: string;
    documents?: string[];
    videos?: string[];
  };
} 