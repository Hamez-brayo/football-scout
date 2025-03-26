'use client';

import { useRef, useState, useEffect, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  threshold?: number;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right';
  delay?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  threshold = 0.1,
  className = '',
  animation = 'fade-up',
  delay = 0,
  once = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Define animation classes
  const animationClasses = {
    'fade-up': 'opacity-0 translate-y-10',
    'fade-in': 'opacity-0',
    'slide-left': 'opacity-0 translate-x-10',
    'slide-right': 'opacity-0 -translate-x-10',
  };

  const visibleClasses = 'opacity-100 translate-y-0 translate-x-0';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, once]);

  return (
    <div
      ref={ref}
      className={`
        ${className}
        ${isVisible ? visibleClasses : animationClasses[animation]}
        transition-all duration-700 ease-out
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
} 