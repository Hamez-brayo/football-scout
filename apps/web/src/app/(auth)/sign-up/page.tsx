'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signInWithGoogle, signInWithApple } = useAuth();
  const router = useRouter();

  // Clear form fields on mount/refresh
  useEffect(() => {
    const clearFields = () => {
      setEmail('');
      setPassword('');
      setDisplayName('');
      setError('');
    };

    clearFields();
    // Also clear when window gains focus
    window.addEventListener('focus', clearFields);
    return () => window.removeEventListener('focus', clearFields);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signUp(email, password, displayName);
      router.push('/register');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    
    setError('');
    setIsLoading(true);
    
    try {
      const user = await signInWithGoogle();
      if (user) {
        router.push('/register');
      }
      // If user is null, the popup was closed by the user - no need to show an error
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError('');
    try {
      await signInWithApple();
      router.push('/register');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign in with Apple');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 backdrop-blur-lg bg-white/80 dark:bg-black/50 p-8 rounded-xl border border-gray-200 dark:border-white/10 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            First, let's set up your login credentials
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-500/50 text-red-800 dark:text-red-200 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleGoogleSignIn}
            type="button"
            disabled={isLoading}
            className="group relative w-full flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-white/10 text-sm font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-black/50 hover:bg-gray-50 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <button
            onClick={handleAppleSignIn}
            type="button"
            className="group relative w-full flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-white/10 text-sm font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-black/50 hover:bg-gray-50 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M17.05 20.28c-.98.95-2.05.88-3.08.38-1.09-.52-2.08-.53-3.2 0-1.39.68-2.12.57-3.02-.31C3.97 16.32 4.54 11.15 8.6 10.87c1.09.04 1.88.56 2.57.58.96.04 1.82-.44 2.74-.52 2.03-.17 3.18.74 3.89 2.15-3.47 2.08-2.86 6.76.7 7.45-.53 1.04-.99 2.03-1.45 2.75zM12.9 3.72c1.93-.24 3.66 1.25 3.94 3.01-2.28.3-4.01-1.16-3.94-3.01z"
              />
            </svg>
            Continue with Apple
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-black/50 text-gray-500 dark:text-gray-400">Or</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="display-name" className="sr-only">
                Display Name
              </label>
              <input
                id="display-name"
                name="display-name"
                type="text"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-white/10 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 dark:focus:ring-white/30 focus:border-indigo-500 dark:focus:border-white/30 focus:z-10 sm:text-sm"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-white/10 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 dark:focus:ring-white/30 focus:border-indigo-500 dark:focus:border-white/30 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-white/10 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 dark:focus:ring-white/30 focus:border-indigo-500 dark:focus:border-white/30 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200`}
            >
              {isLoading ? 'Creating account...' : 'Continue'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link
            href="/sign-in"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
} 