'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { RegistrationProvider } from '@/contexts/RegistrationContext';
import RegistrationProgress from './components/RegistrationProgress';
import UserTypeSelection from './components/UserTypeSelection';

export default function RegisterPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <RegistrationProvider>
      <div className="min-h-screen bg-transparent py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Complete Your Profile
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Let's get you set up with the perfect account for your needs
            </p>
          </div>

          <RegistrationProgress />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="backdrop-blur-xl bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-2xl p-8">
              <UserTypeSelection />
            </div>
          </div>
        </div>
      </div>
    </RegistrationProvider>
  );
} 