'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthMiddleware({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // Store the attempted URL to redirect back after login
      sessionStorage.setItem('redirectUrl', pathname);
      router.push('/sign-in');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="bg-[#0f0f0f]/80 backdrop-blur-xl rounded-xl p-8 shadow-2xl border border-white/10">
          <div className="animate-pulse text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
} 