'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';

interface ImageParallaxProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export default function ImageParallax({
  children,
  strength = 20,
  className = '',
}: ImageParallaxProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mouseOver, setMouseOver] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const { left, top } = ref.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the container
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    // Calculate percentage positions
    const percentX = (x / dimensions.width - 0.5) * 2; // -1 to 1
    const percentY = (y / dimensions.height - 0.5) * 2; // -1 to 1
    
    setPosition({ x: percentX, y: percentY });
  };

  const handleMouseEnter = () => {
    setMouseOver(true);
  };

  const handleMouseLeave = () => {
    setMouseOver(false);
    // Reset position with animation
    setPosition({ x: 0, y: 0 });
  };

  const transformStyle = {
    transform: mouseOver
      ? `perspective(1000px) rotateY(${position.x * strength / 2}deg) rotateX(${-position.y * strength / 3}deg) scale3d(1.02, 1.02, 1.02)`
      : 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)',
    transition: mouseOver ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
  };

  return (
    <div
      ref={ref}
      className={`cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={transformStyle}
    >
      {children}
    </div>
  );
} 