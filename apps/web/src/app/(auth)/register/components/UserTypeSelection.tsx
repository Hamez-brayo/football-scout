'use client';

import { UserType } from '@/types/registration';

interface UserTypeSelectionProps {
  onSelect: (type: UserType) => void;
}

export default function UserTypeSelection({ onSelect }: UserTypeSelectionProps) {
  const userTypes = [
    {
      id: 'talent',
      title: 'Talent',
      description: 'Players, coaches, and other football professionals',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'organization',
      title: 'Organization',
      description: 'Clubs, academies, and football organizations',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Which Floor Would You Like to Visit?
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Select your role to start your journey in the football world
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id as UserType)}
            className="group relative p-6 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-200 hover:shadow-lg dark:hover:shadow-xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-200">
                {type.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {type.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {type.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 