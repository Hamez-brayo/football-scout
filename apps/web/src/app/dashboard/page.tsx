'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (!user?.uid) {
      router.push('/login');
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${user.uid}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-5 py-6 sm:px-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
            <h3 className="text-2xl font-bold leading-6 text-gray-900 dark:text-white">
              Welcome to Your Dashboard
            </h3>
            {userData && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Hello, {userData.fullName || 'Player'}! You're registered as a {userData.userType?.toLowerCase() || 'talent'}.
              </p>
            )}
          </div>

          <div className="mt-6">
            <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/50 p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-indigo-400 dark:bg-indigo-500 rounded-md flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-indigo-800 dark:text-indigo-200">
                    Complete Your Profile
                  </h4>
                  <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-300">
                    Take some time to fill out your profile details. This will help us match you with the right opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">Profile Details</h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Add your playing history, achievements, and skills
                </p>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update Profile
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">Media Gallery</h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Upload photos, videos, and documents
                </p>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Manage Media
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 