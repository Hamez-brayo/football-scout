'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import { 
  House,
  User,
  ChartLine,
  Image,
  Trophy,
  GearSix,
  X,
  List,
  VideoCamera,
  Calendar,
  MapPin,
  SignOut,
  Warning
} from '@phosphor-icons/react';

interface NavigationItem {
  name: string;
  href: string;
  icon: typeof House;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/talent', icon: ChartLine },
  { name: 'Profile', href: '/talent/profile', icon: User },
  { name: 'Videos', href: '/talent/videos', icon: VideoCamera },
  { name: 'Stats', href: '/talent/stats', icon: ChartLine },
  { name: 'Achievements', href: '/talent/achievements', icon: Trophy },
  { name: 'Schedule', href: '/talent/schedule', icon: Calendar },
  { name: 'Locations', href: '/talent/locations', icon: MapPin },
];

export default function TalentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isComplete, missingFields, completionPercentage, sections } = useProfileCompletion();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/80" />
        <div className="fixed inset-0 flex">
          <div className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button type="button" className="-m-2.5 p-2.5 text-white" onClick={() => setSidebarOpen(false)}>
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
              <div className="flex h-16 shrink-0 items-center">
                <Link href="/talent" className="text-xl font-semibold text-white">
                  Vysion Analytics
                </Link>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`
                            group flex gap-x-3 rounded-md p-2 text-sm font-semibold
                            ${pathname === item.href ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                          `}
                        >
                          <Icon className="h-6 w-6 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/talent" className="text-xl font-semibold text-white">
              Vysion Analytics
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        group flex gap-x-3 rounded-md p-2 text-sm font-semibold
                        ${pathname === item.href ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                      `}
                    >
                      <Icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72 bg-gray-900">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-800/40 bg-gray-900 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-gray-400 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <List className="h-6 w-6" />
          </button>

          <div className="h-6 w-px bg-gray-800/40 lg:hidden" aria-hidden="true" />
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            
            {/* Profile dropdown */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="relative">
                <button
                  type="button"
                  className="-m-1.5 flex items-center p-1.5 text-gray-400 hover:text-gray-300"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <span className="text-sm text-gray-300">{user?.displayName}</span>
                  <div className="ml-2 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-gray-800 py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <button
                      onClick={handleLogout}
                      className="block w-full px-3 py-1 text-sm leading-6 text-white hover:bg-gray-700 text-left"
                    >
                      <div className="flex items-center">
                        <SignOut className="mr-2 h-4 w-4" />
                        Sign out
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile completion notification */}
        {!isComplete && (
          <div className="bg-blue-900/50 border-b border-blue-800">
            <div className="px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Warning className="h-5 w-5 text-blue-400" />
                    <p className="ml-3 text-sm text-blue-300">
                      Complete your profile to increase visibility to scouts
                    </p>
                  </div>
                  <Link
                    href="/talent/profile"
                    className="ml-4 shrink-0 rounded-md bg-blue-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    Complete Profile
                  </Link>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="h-2 w-full bg-blue-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-blue-300">{completionPercentage}%</span>
                    <span className="text-sm text-blue-300">•</span>
                    <span className="text-sm text-blue-300">{missingFields.length} items remaining</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="py-10 bg-gray-900">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
} 