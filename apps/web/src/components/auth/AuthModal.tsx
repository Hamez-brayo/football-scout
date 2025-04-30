'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

type AuthMode = 'sign-in' | 'sign-up';

interface AuthModalProps {
  defaultMode?: AuthMode;
}

export default function AuthModal({ defaultMode = 'sign-in' }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);

  return (
    <Card className="w-full bg-transparent border-0 shadow-none">
      <CardHeader className="space-y-3 pb-2">
        <CardTitle className="text-3xl font-bold text-center text-white">
          {mode === 'sign-in' ? 'Sign in' : 'Create an account'}
        </CardTitle>
        <CardDescription className="text-center text-white/80 text-base">
          {mode === 'sign-in'
            ? 'Enter your credentials to sign in to your account'
            : 'Enter your details below to create your account'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {mode === 'sign-in' ? <SignInForm /> : <SignUpForm />}
      </CardContent>
      <CardFooter className="flex justify-center pt-2">
        <div className="w-full text-sm text-center text-white/70">
          {mode === 'sign-in' ? (
            <>
              Don't have an account?{' '}
              <Button
                variant="link"
                className="p-0 h-auto text-indigo-300 hover:text-indigo-100"
                onClick={() => setMode('sign-up')}
              >
                Sign up
              </Button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Button
                variant="link"
                className="p-0 h-auto text-indigo-300 hover:text-indigo-100"
                onClick={() => setMode('sign-in')}
              >
                Sign in
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
} 