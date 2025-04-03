'use client';

import { useState } from 'react';
import { UserType } from '@/types/user';
import { motion } from 'framer-motion';
import { FaFutbol, FaUserTie, FaBuilding } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const userTypeOptions = [
  {
    type: UserType.TALENT,
    title: 'Player/Talent',
    description: 'Create your player profile and showcase your skills',
    icon: FaFutbol,
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    type: UserType.AGENT,
    title: 'Agent',
    description: 'Connect with talents and clubs as a licensed agent',
    icon: FaUserTie,
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    type: UserType.CLUB,
    title: 'Club',
    description: 'Represent your club and discover new talents',
    icon: FaBuilding,
    color: 'from-indigo-500 to-indigo-600',
  },
];

export function UserTypeSelection() {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {userTypeOptions.map((option) => (
          <motion.button
            key={option.type}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelectedType(option.type)}
            className={`
              relative p-4 rounded-xl text-left transition-all duration-200
              ${
                selectedType === option.type
                  ? 'bg-indigo-600 ring-2 ring-indigo-500'
                  : 'bg-[#1a1a1a] hover:bg-[#222222] border border-white/10'
              }
            `}
          >
            <div className="flex items-center">
              <option.icon 
                className={`
                  text-2xl mr-3
                  ${selectedType === option.type ? 'text-white' : 'text-indigo-400'}
                `}
              />
              <div>
                <h3 className="text-base font-semibold text-white">
                  {option.title}
                </h3>
                <p className={`
                  text-sm mt-1
                  ${selectedType === option.type ? 'text-indigo-100' : 'text-gray-400'}
                `}>
                  {option.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {selectedType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <button
            onClick={() => {
              router.push(`/register/${selectedType.toLowerCase()}`);
            }}
            className="
              w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg
              font-medium hover:bg-indigo-500 transition-colors
              flex items-center justify-center
            "
          >
            Continue
          </button>
        </motion.div>
      )}
    </div>
  );
} 