'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserType,
  RegistrationStep,
  TalentRegistrationData,
  RegistrationContextType,
  FormErrors
} from '../types/registration';
import { validateStep } from '@/app/(auth)/register/talent/validation/schemas';
import {
  saveRegistrationData,
  loadRegistrationData,
  clearRegistrationData,
  isRegistrationComplete,
  getCompletedSteps,
  getNextIncompleteStep,
  formatRegistrationData
} from '@/utils/registration';

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState<UserType>();
  const [registrationData, setRegistrationData] = useState<Partial<TalentRegistrationData>>({});
  const [errors, setErrors] = useState<FormErrors>({});

  // Load saved registration data on mount
  useEffect(() => {
    const savedData = loadRegistrationData();
    if (savedData) {
      setUserType(savedData.userType);
      setCurrentStep(savedData.currentStep);
      setRegistrationData(savedData.data);
    }
  }, []);

  // Save registration data when it changes
  useEffect(() => {
    if (userType) {
      saveRegistrationData(userType, currentStep, registrationData);
    }
  }, [userType, currentStep, registrationData]);

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
        return getTalentSteps().map(step => ({
          ...step,
          isComplete: getCompletedSteps(registrationData).includes(step.id)
        }));
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

  const updateRegistrationData = (data: Partial<TalentRegistrationData>) => {
    const formattedData = formatRegistrationData({
      ...registrationData,
      ...data
    });
    setRegistrationData(formattedData);
  };

  const goToNextStep = async () => {
    // Validate current step before proceeding
    const currentStepId = currentStepData?.id;
    if (currentStepId) {
      let stepData;
      switch (currentStepId) {
        case 'basic-info':
          stepData = registrationData.basicInfo;
          break;
        case 'playing-info':
          stepData = registrationData.footballProfile;
          break;
        case 'achievements':
          stepData = registrationData.achievements;
          break;
        case 'media':
          stepData = registrationData.media;
          break;
      }

      const validationResult = await validateStep(currentStepId, stepData);
      if (!validationResult.success) {
        setErrors(validationResult.errors || {});
        return;
      }
    }

    if (currentStep < visibleSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      clearErrors();
    } else {
      // Check if registration is complete
      if (isRegistrationComplete(registrationData)) {
        clearRegistrationData();
        router.push('/dashboard');
      } else {
        const nextStep = getNextIncompleteStep(registrationData);
        const nextStepIndex = visibleSteps.findIndex(step => step.id === nextStep);
        if (nextStepIndex !== -1) {
          setCurrentStep(nextStepIndex);
        }
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      clearErrors();
    }
  };

  const isStepComplete = (stepId: string) => {
    return getCompletedSteps(registrationData).includes(stepId);
  };

  const markStepComplete = (stepId: string) => {
    const updatedSteps = visibleSteps.map(step =>
      step.id === stepId ? { ...step, isComplete: true } : step
    );
    // Update step completion status is now handled by getCompletedSteps
  };

  const clearErrors = () => {
    setErrors({});
  };

  const value: RegistrationContextType = {
    currentStep,
    setCurrentStep,
    registrationData,
    updateRegistrationData,
    visibleSteps: getSteps(),
    userType,
    setUserType,
    goToNextStep,
    goToPreviousStep,
    isStepComplete,
    markStepComplete,
    currentStepData,
    totalSteps,
    progress,
    errors,
    setErrors,
    clearErrors,
    validateStep: async (stepId: string) => {
      let stepData;
      switch (stepId) {
        case 'basic-info':
          stepData = registrationData.basicInfo;
          break;
        case 'playing-info':
          stepData = registrationData.footballProfile;
          break;
        case 'achievements':
          stepData = registrationData.achievements;
          break;
        case 'media':
          stepData = registrationData.media;
          break;
      }

      const validationResult = await validateStep(stepId, stepData);
      if (!validationResult.success) {
        setErrors(validationResult.errors || {});
      }
      return validationResult.success;
    }
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