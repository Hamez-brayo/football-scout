import React from 'react';

const mockRegistrationContext = {
  currentStep: 0,
  setCurrentStep: jest.fn(),
  registrationData: {},
  updateRegistrationData: jest.fn(),
  visibleSteps: [
    { id: 'user-type', title: 'User Type', description: 'Select user type' },
    { id: 'basic-info', title: 'Basic Info', description: 'Enter basic information' },
    { id: 'media', title: 'Media', description: 'Upload media' }
  ],
  userType: undefined,
  setUserType: jest.fn(),
  goToNextStep: jest.fn(),
  goToPreviousStep: jest.fn(),
  isStepComplete: jest.fn().mockImplementation(() => false),
  markStepComplete: jest.fn(),
  currentStepData: { id: 'user-type', title: 'User Type', description: 'Select user type' },
  totalSteps: 3,
  progress: 0,
  errors: {},
  setErrors: jest.fn(),
  clearErrors: jest.fn(),
  validateStep: jest.fn().mockImplementation(() => Promise.resolve(true))
};

export const useRegistration = jest.fn().mockImplementation(() => mockRegistrationContext);

export const RegistrationProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const RegistrationContext = {
  Provider: ({ children, value }: { children: React.ReactNode, value?: any }) => (
    <>{children}</>
  )
};

export default RegistrationContext; 