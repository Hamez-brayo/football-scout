'use client';

import dynamic from 'next/dynamic';

const ParticlesBackground = dynamic(() => import('@/components/ParticlesBackground'), {
  ssr: false,
  loading: () => null
});

export default function ClientParticles() {
  return <ParticlesBackground />;
} 