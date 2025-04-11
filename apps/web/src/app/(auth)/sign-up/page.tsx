'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ClientParticles from '@/components/ClientParticles';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const { signUp, signInWithGoogle, signInWithApple } = useAuth();
  const router = useRouter();

  // Clear form fields on mount/refresh
  useEffect(() => {
    const clearFields = () => {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setDisplayName('');
      setError('');
      setFormErrors({});
    };

    clearFields();
    // Also clear when window gains focus
    window.addEventListener('focus', clearFields);
    return () => window.removeEventListener('focus', clearFields);
  }, []);

  const validateForm = () => {
    const errors: {
      displayName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // Display Name validation
    if (!displayName) {
      errors.displayName = 'Display name is required';
    } else if (displayName.length < 2) {
      errors.displayName = 'Display name must be at least 2 characters';
    }

    // Email validation
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormErrors({});

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await signUp(email, password, displayName);
      // Let middleware handle the redirection based on registration status
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      if (errorMessage.includes('auth/email-already-in-use')) {
        setError('An account with this email already exists');
      } else if (errorMessage.includes('auth/invalid-email')) {
        setError('Invalid email address');
      } else if (errorMessage.includes('auth/weak-password')) {
        setError('Password is too weak. Please use a stronger password');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    
    setError('');
    setIsLoading(true);
    
    try {
      await signInWithGoogle();
      // Let middleware handle the redirection based on registration status
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
      // Let middleware handle the redirection based on registration status
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign in with Apple');
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0">
        <ClientParticles />
      </div>
      <div className="relative min-h-screen flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-black/40 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-xl">
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white text-center">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-gray-400 text-center">
                First, let's set up your login credentials
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
                type="button"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-3 py-2 border border-gray-800 rounded-lg text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <button
                onClick={handleAppleSignIn}
                type="button"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-3 py-2 border border-gray-800 rounded-lg text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.645 4.436c.973 0 2.07-.656 2.796-1.504.648-.762 1.12-1.817 1.12-2.872 0-.14-.012-.28-.036-.398-1.072.043-2.34.75-3.107 1.69-.604.703-1.168 1.759-1.168 2.826 0 .152.018.304.03.356.061.012.158.024.256.024zM16.815 6c-1.735 0-2.473 1.015-3.682 1.015-1.24 0-2.2-1.003-3.707-1.003-1.514 0-3.13.867-3.957 2.312-1.71 2.89-.44 7.167 1.198 9.514.82 1.15 1.771 2.438 3.01 2.392 1.22-.05 1.673-.77 3.142-.77 1.447 0 1.87.77 3.126.744 1.295-.024 2.11-1.143 2.894-2.305.934-1.297 1.296-2.576 1.32-2.642-.03-.012-2.522-.947-2.546-3.79-.018-2.37 1.973-3.484 2.065-3.545-1.15-1.641-2.911-1.815-3.516-1.852a5.09 5.09 0 0 0-.347-.07z" />
                </svg>
                Continue with Apple
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black/40 text-gray-500">Or</span>
                </div>
              </div>

              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-950/50 border border-red-900/50 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    id="display-name"
                    name="display-name"
                    type="text"
                    required
                    className={`w-full px-3 py-2 bg-white/5 border ${
                      formErrors.displayName ? 'border-red-500' : 'border-gray-800'
                    } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={isLoading}
                  />
                  {formErrors.displayName && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.displayName}</p>
                  )}
                </div>
                <div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`w-full px-3 py-2 bg-white/5 border ${
                      formErrors.email ? 'border-red-500' : 'border-gray-800'
                    } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`w-full px-3 py-2 bg-white/5 border ${
                      formErrors.password ? 'border-red-500' : 'border-gray-800'
                    } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
                  )}
                </div>
                <div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`w-full px-3 py-2 bg-white/5 border ${
                      formErrors.confirmPassword ? 'border-red-500' : 'border-gray-800'
                    } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  {formErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link href="/sign-in" className="text-blue-500 hover:text-blue-400">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 