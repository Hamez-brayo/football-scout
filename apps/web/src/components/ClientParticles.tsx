'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';

console.log("Loading ClientParticles component");

interface ClientParticlesProps {
  className?: string;
}

const ParticlesBackground = dynamic(() => import('./ParticlesBackground'), {
  ssr: false,
  loading: () => {
    console.log("Loading ParticlesBackground...");
    return null;
  }
});

export default function ClientParticles({ className }: ClientParticlesProps) {
  useEffect(() => {
    console.log("ClientParticles mounted");
  }, []);

  return <ParticlesBackground className={className} />;
} 