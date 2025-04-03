'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

type UserType = 'TALENT' | 'AGENT' | 'CLUB';

interface RegistrationStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  isVisible: boolean;
  component?: React.ComponentType;
}

interface RegistrationData {
  userType?: UserType;
  basicInfo?: {
    fullName?: string;
    dateOfBirth?: string;
    nationality?: string;
    [key: string]: any;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    [key: string]: any;
  };
  professionalInfo?: {
    [key: string]: any;
  };
  documents?: {
    [key: string]: any;
  };
  preferences?: {
    [key: string]: any;
  };
}

interface RegistrationContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  registrationData: RegistrationData;
  updateRegistrationData: (data: Partial<RegistrationData>) => void;
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
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState<UserType>();
  const [registrationData, setRegistrationData] = useState<RegistrationData>({});

  // Define steps based on user type
  const getTalentSteps = (): RegistrationStep[] => [
    {
      id: 'basic-info',
      title: 'Personal Information',
      description: 'Tell us about yourself',
      isComplete: false,
      isVisible: true,
    },
    {
      id: 'playing-info',
      title: 'Playing Details',
      description: 'Your position and playing style',
      isComplete: false,
      isVisible: true,
    },
    {
      id: 'experience',
      title: 'Experience',
      description: 'Your football journey',
      isComplete: false,
      isVisible: true,
    },
    {
      id: 'achievements',
      title: 'Achievements',
      description: 'Your notable accomplishments',
      isComplete: false,
      isVisible: true,
    },
    {
      id: 'media',
      title: 'Media & Highlights',
      description: 'Show off your skills',
      isComplete: false,
      isVisible: true,
    }
  ];

  const getAgentSteps = (): RegistrationStep[] => [
    {
      id: 'basic-info',
      title: 'Personal Information',
      description: 'Tell us about yourself',
      isComplete: false,
      isVisible: true,
    },
    {
      id: 'professional-info',
      title: 'Professional Details',
      description: 'Your licensing and expertise',
      isComplete: false,
      isVisible: true,
    },
    {
      id: 'verification',
      title: 'Verification',
      description: 'Verify your credentials',
      isComplete: false,
      isVisible: true,
    },
    {
      id: 'network',
      title: 'Network & Experience',
      description: 'Your connections and track record',
      isComplete: false,
      isVisible: true,
    }
  ];

  const getClubSteps = (): RegistrationStep[] => [
    {
      id: 'basic-info',
      title: 'Club Information',
      description: 'Tell us about your club',
      isComplete: false,
      isVisible: true,
    },
    {
      id: 'facilities',
      title: 'Facilities',
      description: 'Your club facilities',
      isComplete: false,
      isVisible: true,
    },
    {
      id: 'team-info',
      title: 'Team Information',
      description: 'Current squad and staff',
      isComplete: false,
      isVisible: true,
    },
    {
      id: 'verification',
      title: 'Official Verification',
      description: 'Verify your club status',
      isComplete: false,
      isVisible: true,
    }
  ];

  // Get steps based on user type
  const getSteps = () => {
    switch (userType) {
      case 'TALENT':
        return getTalentSteps();
      case 'AGENT':
        return getAgentSteps();
      case 'CLUB':
        return getClubSteps();
      default:
        return [];
    }
  };

  const visibleSteps = getSteps();
  const totalSteps = visibleSteps.length;
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const currentStepData = visibleSteps[currentStep];

  const updateRegistrationData = (data: Partial<RegistrationData>) => {
    setRegistrationData(prev => ({ ...prev, ...data }));
  };

  const goToNextStep = () => {
    if (currentStep < visibleSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Registration complete
      router.push('/dashboard');
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = (stepId: string) => {
    return visibleSteps.find(step => step.id === stepId)?.isComplete || false;
  };

  const markStepComplete = (stepId: string) => {
    const updatedSteps = visibleSteps.map(step =>
      step.id === stepId ? { ...step, isComplete: true } : step
    );
    // We'll use this to track completion in the UI
  };

  const value = {
    currentStep,
    setCurrentStep,
    registrationData,
    updateRegistrationData,
    visibleSteps,
    userType,
    setUserType,
    goToNextStep,
    goToPreviousStep,
    isStepComplete,
    markStepComplete,
    currentStepData,
    totalSteps,
    progress
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
} 