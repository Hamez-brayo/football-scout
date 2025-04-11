'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { 
  User,
  VideoCamera,
  ChartLine,
  Trophy,
  Calendar,
  MapPin
} from '@phosphor-icons/react';

interface QuickAction {
  name: string;
  description: string;
  href: string;
  icon: typeof User;
}

const quickActions: QuickAction[] = [
  {
    name: 'Update Profile',
    description: 'Keep your profile up to date to attract scouts.',
    href: '/talent/profile',
    icon: User
  },
  {
    name: 'Upload Media',
    description: 'Share your best moments and highlights.',
    href: '/talent/media',
    icon: VideoCamera
  },
  {
    name: 'Track Performance',
    description: 'Track your progress and showcase your abilities.',
    href: '/talent/performance',
    icon: ChartLine
  },
  {
    name: 'Add Achievements',
    description: 'Share your awards, certifications and milestones.',
    href: '/talent/achievements',
    icon: Trophy
  }
];

export default function TalentDashboard() {
  const { user } = useAuth();

  return (
    <div className="py-6 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Welcome back, {user?.displayName}</h1>
          <p className="text-gray-400 mt-1">Here's what's happening with your football career</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="overflow-hidden rounded-lg bg-gray-800 shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartLine className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Performance Score</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">8.5</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-400">
                        +0.5
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-gray-800 shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <VideoCamera className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Media Views</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">2.4K</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-400">
                        +12%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-gray-800 shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <User className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Profile Views</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">156</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-400">
                        +25%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-gray-800 shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Trophy className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Achievements</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">12</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-400">
                        New
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-base font-semibold leading-6 text-white mb-4">Quick actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {quickActions.map((action) => (
              <div
                key={action.name}
                className="relative flex items-center space-x-3 rounded-lg border border-gray-700 bg-gray-800 px-6 py-5 shadow-sm hover:border-gray-600"
              >
                <div className="flex-shrink-0">
                  <action.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <a href={action.href} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-white">{action.name}</p>
                    <p className="truncate text-sm text-gray-400">{action.description}</p>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Upcoming Events */}
          <div className="overflow-hidden rounded-lg bg-gray-800 shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-white">Upcoming Events</h2>
                <button className="text-sm font-medium text-blue-400 hover:text-blue-300">
                  View all
                </button>
              </div>
              <div className="mt-6 flow-root">
                <ul role="list" className="-mb-8">
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-700" aria-hidden="true" />
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900">
                            <Calendar className="h-5 w-5 text-blue-300" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-white">Training Session</p>
                            <p className="mt-0.5 text-sm text-gray-400">High-intensity training with Coach Mike</p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-400">
                            <time dateTime="2024-03-20">Tomorrow, 10:00 AM</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="relative pb-8">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-900">
                            <MapPin className="h-5 w-5 text-green-300" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-white">Local Match</p>
                            <p className="mt-0.5 text-sm text-gray-400">vs United FC at Central Stadium</p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-400">
                            <time dateTime="2024-03-23">Saturday, 3:00 PM</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="overflow-hidden rounded-lg bg-gray-800 shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-white">Recent Activity</h2>
                <button className="text-sm font-medium text-blue-400 hover:text-blue-300">
                  View all
                </button>
              </div>
              <div className="mt-6 flow-root">
                <ul role="list" className="divide-y divide-gray-700">
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-purple-900">
                          <VideoCamera className="h-5 w-5 text-purple-300" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white">New highlight video uploaded</p>
                        <p className="text-sm text-gray-400">Your video "Match Highlights vs City FC" is now live</p>
                      </div>
                      <div className="flex-shrink-0 whitespace-nowrap text-sm text-gray-400">
                        2h ago
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-yellow-900">
                          <Trophy className="h-5 w-5 text-yellow-300" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white">Achievement unlocked</p>
                        <p className="text-sm text-gray-400">You earned "Player of the Match" achievement</p>
                      </div>
                      <div className="flex-shrink-0 whitespace-nowrap text-sm text-gray-400">
                        1d ago
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-900">
                          <ChartLine className="h-5 w-5 text-green-300" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white">Performance update</p>
                        <p className="text-sm text-gray-400">Your performance score increased by 0.5 points</p>
                      </div>
                      <div className="flex-shrink-0 whitespace-nowrap text-sm text-gray-400">
                        2d ago
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 