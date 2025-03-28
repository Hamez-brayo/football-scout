'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      await signInWithApple();
      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign in with Apple');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 backdrop-blur-lg bg-white/80 dark:bg-black/50 p-8 rounded-xl border border-gray-200 dark:border-white/10 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Access your dashboard and analytics
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-500/50 text-red-800 dark:text-red-200 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
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
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 bg-white/80 dark:bg-black/50 border border-gray-300 dark:border-white/10 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 dark:focus:ring-white/30 focus:border-indigo-500 dark:focus:border-white/30 focus:z-10 sm:text-sm"
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
                autoComplete="current-password"
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 bg-white/80 dark:bg-black/50 border border-gray-300 dark:border-white/10 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 dark:focus:ring-white/30 focus:border-indigo-500 dark:focus:border-white/30 focus:z-10 sm:text-sm"
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
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 dark:bg-black/50 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="inline-flex w-full justify-center rounded-md border py-2 px-4 text-sm font-medium shadow-sm border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-black/30 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-black/50"
            >
              <span className="sr-only">Sign in with Google</span>
              <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 0 1-6.021-6.022 6.033 6.033 0 0 1 6.021-6.022c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12.545 2C8.195 2 4.603 5.592 4.603 10c0 4.408 3.592 8 7.942 8 4.408 0 8-3.592 8-8 0-.669-.059-1.335-.17-1.982l-7.83.221z" />
              </svg>
            </button>

            <button
              onClick={handleAppleSignIn}
              disabled={isLoading}
              className="inline-flex w-full justify-center rounded-md border py-2 px-4 text-sm font-medium shadow-sm border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-black/30 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-black/50"
            >
              <span className="sr-only">Sign in with Apple</span>
              <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.6 13.8c-.2-.3-.4-.8-.5-1 -.1-.3-.3-1.2-.7-2.2-.4-1-.7-1.5-.9-1.7-.2-.2-.5-.3-.8-.4-.4-.1-.7 0-1.1.2-.4.2-.6.5-.8.9-.2.5-.3.9-.4 1.4-.1.5-.1.9 0 1.4.1.5.3.9.6 1.2.2.3.5.5.8.7.2.1.4.2.7.3h.1c.3 0 .6-.1.9-.3.6-.4.8-1.1.9-1.6.1-.3.1-.5.1-.8h-2v-.7h2.7c0 .7-.1 1.2-.3 1.7z M9.1 15.8c-.6 0-1.2-.2-1.6-.7-.8-.9-.8-2.2-.8-2.9 0-1.5.6-2.9 2-2.9.7 0 1.2.3 1.6.7.8.8.8 2 .8 2.6 0 1.9-.8 3.2-2 3.2z M9.1 10.3c-.9 0-1.3.8-1.3 1.9 0 1.2.6 1.9 1.3 1.9.9 0 1.3-.8 1.3-1.9 0-1.2-.6-1.9-1.3-1.9z M6 15.8c-.6 0-1.2-.2-1.6-.7-.8-.9-.8-2.3-.8-2.9 0-1.5.6-2.9 2-2.9.7 0 1.2.3 1.6.7.8.8.8 2 .8 2.6 0 1.9-.8 3.2-2 3.2z M6 10.3c-.9 0-1.3.8-1.3 1.9 0 1.2.6 1.9 1.3 1.9.9 0 1.3-.8 1.3-1.9.1-1.2-.5-1.9-1.3-1.9z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/sign-up"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
} 