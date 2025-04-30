'use client';

import ClientParticles from '@/components/ClientParticles';
import AuthModal from '@/components/auth/AuthModal';

export default function SignInPage() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0">
        <ClientParticles />
      </div>
      <div className="relative min-h-screen flex items-center justify-center p-4 z-10">
        <AuthModal defaultMode="sign-in" />
      </div>
    </div>
  );
} 