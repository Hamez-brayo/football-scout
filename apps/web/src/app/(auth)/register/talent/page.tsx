'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthMiddleware from '@/middleware/authMiddleware';
import { useRegistration } from '@/contexts/RegistrationContext';
import BasicInfoForm from './forms/BasicInfoForm';
import FootballProfileForm from './forms/FootballProfileForm';
import SkillsAttributesForm from './forms/SkillsAttributesForm';
import MediaVerificationForm from './forms/MediaVerificationForm';

const steps = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Tell us about yourself',
    component: BasicInfoForm,
  },
  {
    id: 'football-profile',
    title: 'Football Profile',
    description: 'Share your football journey',
    component: FootballProfileForm,
  },
  {
    id: 'skills-attributes',
    title: 'Skills & Attributes',
    description: 'Rate your abilities',
    component: SkillsAttributesForm,
  },
  {
    id: 'media-verification',
    title: 'Media & Verification',
    description: 'Upload your media and documents',
    component: MediaVerificationForm,
  },
];

export default function TalentRegistration() {
  const { currentStep, setTotalSteps, registrationData } = useRegistration();
  const router = useRouter();

  useEffect(() => {
    setTotalSteps(steps.length);
  }, [setTotalSteps]);

  // Redirect to dashboard if registration is complete
  useEffect(() => {
    if (registrationData.isComplete) {
      router.push('/dashboard');
    }
  }, [registrationData.isComplete, router]);

  const CurrentStepComponent = steps[currentStep]?.component;

  return (
    <AuthMiddleware>
      <div className="min-h-screen bg-transparent py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {steps[currentStep]?.title}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {steps[currentStep]?.description}
              </p>
            </div>

            {CurrentStepComponent && <CurrentStepComponent />}
          </div>
        </div>
      </div>
    </AuthMiddleware>
  );
} 