'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PersonalInformationForm from './PersonalInformationForm';
import FootballJourneyForm from './FootballJourneyForm';
import { UserPath, PlayingStatus, PlayingLevel, ProfessionalFocus } from '@/types/registration';
import { useRegistration } from '@/contexts/RegistrationContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

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
  }
];

export default function RegistrationFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { updateRegistrationData } = useRegistration();
  const router = useRouter();

  const handleStepComplete = async (data: any) => {
    try {
      setError(null);
      setIsLoading(true);
      
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      // Update registration context
      updateRegistrationData(data);

      // Submit data to backend based on current step
      if (currentStep === 0) { // Personal Information
        await fetch('/api/users/register/initial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.uid,
            basicInfo: data
          })
        });
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Error submitting step data:', error);
      setError(error instanceof Error ? error.message : 'Failed to save data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJourneyComplete = async (data: {
    status: PlayingStatus;
    level?: PlayingLevel;
    focus?: ProfessionalFocus;
    path: UserPath;
  }) => {
    try {
      setError(null);
      setIsLoading(true);
      
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      console.log('Journey data received:', data);

      // Update registration context with journey data
      updateRegistrationData({
        userType: 'TALENT',
        basicInfo: {
          fullName: '',
          dateOfBirth: '',
          nationality: '',
          email: user.email || '',
          phone: ''
        },
        footballProfile: {
          position: '',
          height: 0,
          weight: 0,
          preferredFoot: 'right',
          experienceLevel: data.level === 'amateur' ? 'amateur' : 
                          data.level === 'semi_pro' ? 'semi-professional' :
                          data.level === 'pro' ? 'professional' : 'youth'
        },
        media: {
          profilePhoto: ''
        }
      });

      // Submit journey data to backend
      const response = await fetch('/api/users/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          journeyData: {
            path: data.path,
            currentStatus: data.status === 'currently_playing' ? 'PLAYING' : 'PROFESSIONAL',
            level: data.level?.toUpperCase() || 'AMATEUR',
            experience: '5' // Default experience value
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save journey data');
      }

      // Get dashboard path based on user type
      const dashboardPath = getDashboardPath(data.path);
      router.push(dashboardPath);
    } catch (error) {
      console.error('Error in journey step:', error);
      setError(error instanceof Error ? error.message : 'Failed to save journey data');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get the correct dashboard path
  const getDashboardPath = (userType: UserPath): string => {
    switch (userType) {
      case 'TALENT':
        return '/dashboard/player';
      case 'AGENT':
        return '/dashboard/agent';
      case 'CLUB':
        return '/dashboard/club';
      default:
        return '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
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
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : (
                    <>
                      {index === 0 && (
                        <PersonalInformationForm onComplete={handleStepComplete} />
                      )}
                      {index === 1 && (
                        <FootballJourneyForm
                          onComplete={(journeyData) => handleJourneyComplete({
                            status: journeyData.status,
                            level: journeyData.level,
                            focus: journeyData.focus,
                            path: journeyData.path
                          })}
                        />
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}