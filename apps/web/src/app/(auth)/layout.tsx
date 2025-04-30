import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 to-indigo-950">
        {/* Background effects */}
        <div className="absolute inset-0 w-full h-full bg-[url('/football-pattern.svg')] opacity-5"></div>
        
        {/* Decorative blurred circles */}
        <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
        
        {/* Glass container - centered and sized correctly */}
        <div className="relative w-full max-w-md mx-auto z-10 flex items-center justify-center">
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/10 p-8 w-full">
            {children}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
} 