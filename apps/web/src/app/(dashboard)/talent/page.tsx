'use client';

import { useAuth } from '@/contexts/AuthContext';
import { 
  UserIcon, 
  VideoCameraIcon, 
  ChartBarIcon, 
  TrophyIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const quickActions = [
  {
    name: 'Complete Profile',
    description: 'Add your personal information and career details',
    href: '/talent/profile',
    icon: UserIcon,
  },
  {
    name: 'Upload Highlights',
    description: 'Share your best moments on the field',
    href: '/talent/media',
    icon: VideoCameraIcon,
  },
  {
    name: 'Add Performance Stats',
    description: 'Track your match statistics and progress',
    href: '/talent/performance',
    icon: ChartBarIcon,
  },
  {
    name: 'Update Achievements',
    description: 'Showcase your awards and recognition',
    href: '/talent/achievements',
    icon: TrophyIcon,
  },
];

const recentActivity = [
  {
    id: 1,
    type: 'Profile Update',
    description: 'Updated personal information',
    date: '2 hours ago',
  },
  {
    id: 2,
    type: 'Media Upload',
    description: 'Added new match highlights',
    date: '1 day ago',
  },
  {
    id: 3,
    type: 'Performance',
    description: 'Added stats from recent match',
    date: '3 days ago',
  },
];

export default function TalentDashboard() {
  const { user } = useAuth();
  const profileCompletion = 35; // This would be calculated based on actual profile data

  const profileSteps = [
    { name: 'Personal Information', completed: true },
    { name: 'Career History', completed: false },
    { name: 'Performance Stats', completed: false },
    { name: 'Media Gallery', completed: true },
    { name: 'Achievements', completed: false },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.email?.split('@')[0] || 'Player'}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Here's what's happening with your profile
          </p>
        </div>
      </div>

      {/* Profile Completion */}
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Profile Completion</h2>
          <div className="mt-3">
            <div className="relative">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                <div
                  style={{ width: `${profileCompletion}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                />
              </div>
              <span className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                {profileCompletion}% Complete
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {profileSteps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`flex-shrink-0 h-5 w-5 rounded-full ${step.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                  <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">{step.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="relative group bg-white dark:bg-gray-800 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 ring-4 ring-white dark:ring-gray-800">
                <action.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {action.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {action.description}
              </p>
            </div>
            <span
              className="absolute top-6 right-6 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500"
              aria-hidden="true"
            >
              <ArrowRightIcon className="h-6 w-6" />
            </span>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
          <div className="mt-4 space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-indigo-600 mt-2" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">{activity.type}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.description}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 