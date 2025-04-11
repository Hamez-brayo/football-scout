'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { RegistrationProvider } from '@/contexts/RegistrationContext';
import RegistrationFlow from './components/RegistrationFlow';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Register() {
  const { user } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkRegistrationStatus() {
      if (!user?.uid) {
        setIsChecking(false);
        return;
      }

      try {
        setError(null);
        const response = await fetch(`/api/users/${user.uid}/registration-status`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // User not found in database yet, which is fine for registration
            setIsChecking(false);
            return;
          }
          throw new Error('Failed to check registration status');
        }

        const data = await response.json();

        if (data.isRegistrationComplete) {
          // If registration is complete, redirect to appropriate dashboard
          router.push('/talent');
          return;
        }
        
        // If registration is not complete, allow access to registration flow
        setIsChecking(false);
      } catch (error) {
        console.error('Error checking registration status:', error);
        setError('Unable to verify registration status. Please try again later.');
      } finally {
        setIsChecking(false);
      }
    }

    checkRegistrationStatus();
  }, [user, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <LoadingSpinner size="lg" message="Checking registration status..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-8 rounded-lg bg-white dark:bg-gray-800 shadow-xl">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <RegistrationProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <RegistrationFlow />
      </div>
    </RegistrationProvider>
  );
} 