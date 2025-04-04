'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { RegistrationProvider } from '@/contexts/RegistrationContext';
import RegistrationFlow from './components/RegistrationFlow';

export default function Register() {
  const { user } = useAuth();
  const router = useRouter();

  // Only redirect if user is already registered
  useEffect(() => {
    if (user?.registrationCompleted) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <RegistrationProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <RegistrationFlow />
      </div>
    </RegistrationProvider>
  );
} 