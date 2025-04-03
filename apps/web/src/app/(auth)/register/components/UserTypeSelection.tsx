'use client';

import { useRegistration } from '@/contexts/RegistrationContext';
import { UserIcon, BriefcaseIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const userTypes = [
  {
    id: 'TALENT',
    title: 'Player/Talent',
    description: 'I am a football player looking to showcase my talent',
    icon: UserIcon,
  },
  {
    id: 'AGENT',
    title: 'Agent/Scout',
    description: 'I represent and scout football talent',
    icon: BriefcaseIcon,
  },
  {
    id: 'CLUB',
    title: 'Club',
    description: 'I represent a football club or organization',
    icon: BuildingOffice2Icon,
  },
];

export default function UserTypeSelection() {
  const { setUserType, updateRegistrationData, markStepComplete } = useRegistration();
  const router = useRouter();

  const handleSelection = (type: 'TALENT' | 'AGENT' | 'CLUB') => {
    setUserType(type);
    updateRegistrationData({ userType: type });
    markStepComplete('user-type');
    
    // Navigate to the appropriate registration form
    router.push(`/register/${type.toLowerCase()}`);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {userTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handleSelection(type.id as 'TALENT' | 'AGENT' | 'CLUB')}
            className="relative flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-200"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-50 dark:bg-indigo-900/20 mb-4">
              <type.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {type.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              {type.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
} 