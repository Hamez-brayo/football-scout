'use client';

import { useState, useEffect } from 'react';
import PersonalInformationForm from './PersonalInformationForm';
import FootballJourneyForm from './FootballJourneyForm';
import PathSpecificForm from './PathSpecificForm';
import MediaUpload from './MediaUpload';
import { UserPath } from '@/types/registration';
import { useRegistration } from '@/contexts/RegistrationContext';

const steps = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Tell us about yourself'
  },
  {
    id: 'journey',
    title: 'Football Journey',
    description: 'Your path in football'
  },
  {
    id: 'specific',
    title: 'Path Details',
    description: 'Specific information based on your role'
  },
  {
    id: 'media',
    title: 'Media & Documents',
    description: 'Upload your photos and documents'
  }
];

export default function RegistrationFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const { registrationData, updateRegistrationData } = useRegistration();
  const [selectedPath, setSelectedPath] = useState<UserPath | null>(null);

  // Update selectedPath when registrationData.path changes
  useEffect(() => {
    if (registrationData.path) {
      setSelectedPath(registrationData.path);
    }
  }, [registrationData.path]);

  const handleStepComplete = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleJourneyComplete = (data: any) => {
    // The path is already set in the registration context
    handleStepComplete();
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Registration Progress
        </h2>
        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-8">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`${
              index === currentStep ? 'opacity-100' : 'opacity-40'
            } transition-opacity duration-200`}
          >
            <div className="flex items-center mb-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            </div>

            {index === currentStep && (
              <div className="mt-4">
                {index === 0 && (
                  <PersonalInformationForm onComplete={handleStepComplete} />
                )}
                {index === 1 && (
                  <FootballJourneyForm onComplete={handleJourneyComplete} />
                )}
                {index === 2 && selectedPath && (
                  <PathSpecificForm
                    path={selectedPath}
                    onComplete={handleStepComplete}
                  />
                )}
                {index === 3 && (
                  <MediaUpload onComplete={handleStepComplete} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 