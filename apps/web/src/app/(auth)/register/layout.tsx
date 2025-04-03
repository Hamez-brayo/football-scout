import { Metadata } from 'next';
import ParticlesBackground from '@/components/ParticlesBackground';

export const metadata: Metadata = {
  title: 'Register - Football Scout',
  description: 'Join Football Scout as a player, agent, or club.',
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <ParticlesBackground />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
} 