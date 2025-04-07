'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
  const [selectedPath, setSelectedPath] = useState<UserPath | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { updateRegistrationData, registrationData } = useRegistration();

  const handleStepComplete = async (data: any) => {
    try {
      setError(null);
      
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      // Update registration context
      updateRegistrationData(data);

      // Submit data to backend based on current step
      switch (currentStep) {
        case 0: // Personal Information
          await fetch('/api/users/register/initial', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.uid,
              basicInfo: data
            })
          });
          break;

        case 1: // Football Journey
          setSelectedPath(data.path);
          await fetch('/api/users/journey', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.uid,
              journeyData: data
            })
          });
          break;

        case 2: // Path Specific
          await fetch('/api/users/path-details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.uid,
              pathType: selectedPath,
              pathData: data
            })
          });
          break;

        case 3: // Media Upload
          await fetch('/api/users/media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.uid,
              mediaData: data
            })
          });
          
          // Final step - mark registration as complete
          await fetch('/api/users/complete-registration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.uid
            })
          });
          break;
      }

      // Move to next step if not the last one
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Error submitting step data:', error);
      setError(error instanceof Error ? error.message : 'Failed to save data');
    }
  };

  const handleJourneyComplete = async (data: any) => {
    try {
      setError(null);
      
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      // Update registration context with journey data
      updateRegistrationData(data);

      // Set the selected path from the journey data
      setSelectedPath(data.journey.path.toLowerCase() as UserPath);

      // Submit journey data to backend
      await fetch('/api/users/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          journeyData: data.journey
        })
      });

      // Move to next step
      setCurrentStep(prev => prev + 1);
    } catch (error) {
      console.error('Error in journey step:', error);
      setError(error instanceof Error ? error.message : 'Failed to save journey data');
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
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