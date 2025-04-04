'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AgentDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Scout Dashboard</h1>
            </div>
            <div className="flex items-center">
              {/* Placeholder for user menu */}
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Welcome, {user?.displayName}</span>
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    {user?.displayName?.[0]?.toUpperCase() || 'U'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Profile Completion Banner */}
        <div className="mb-8 bg-indigo-50 dark:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">Complete Your Profile</h2>
              <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-300">
                Enhance your credibility by completing your scout profile
              </p>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors">
              Continue Setup
            </button>
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-indigo-100 dark:bg-indigo-800 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
            <p className="mt-2 text-sm text-indigo-700 dark:text-indigo-300">30% Complete</p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Talent Pool */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Talent Pool</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Tracked Players</span>
                <span className="text-gray-900 dark:text-white font-medium">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Shortlisted</span>
                <span className="text-gray-900 dark:text-white font-medium">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Recent Discoveries</span>
                <span className="text-gray-900 dark:text-white font-medium">0</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                No recent activity to display
              </div>
            </div>
          </div>

          {/* Upcoming Scouting Events */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                No upcoming scouting events scheduled
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 text-left rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all duration-200">
                <h4 className="font-medium text-gray-900 dark:text-white">Search Players</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Browse available talent</p>
              </button>
              <button className="p-4 text-left rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all duration-200">
                <h4 className="font-medium text-gray-900 dark:text-white">Schedule Event</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Plan scouting activities</p>
              </button>
              <button className="p-4 text-left rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all duration-200">
                <h4 className="font-medium text-gray-900 dark:text-white">Generate Report</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Create scouting reports</p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 