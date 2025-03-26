'use client';

import { useEffect, useRef } from 'react';

interface FloatingIcon {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  icon: React.ReactNode;
}

interface FloatingIconsProps {
  className?: string;
  iconCount?: number;
  icons: React.ReactNode[];
}

export default function FloatingIcons({
  className = '',
  iconCount = 15,
  icons,
}: FloatingIconsProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<FloatingIcon[]>([]);
  const frameRef = useRef<number>(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    // Initialize floating icons
    iconsRef.current = Array(iconCount)
      .fill(0)
      .map((_, i) => ({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1 + 0.8, // Size factor between 0.8 and 1.8
        opacity: Math.random() * 0.5 + 0.1, // Opacity between 0.1 and 0.6
        speedX: (Math.random() - 0.5) * 0.5, // Speed between -0.25 and 0.25
        speedY: (Math.random() - 0.5) * 0.5,
        icon: icons[i % icons.length],
      }));
    
    const updatePositions = () => {
      iconsRef.current = iconsRef.current.map(icon => {
        let newX = icon.x + icon.speedX;
        let newY = icon.y + icon.speedY;
        
        // Bounce off edges
        if (newX < 0 || newX > width) {
          icon.speedX = -icon.speedX;
          newX = icon.x + icon.speedX;
        }
        
        if (newY < 0 || newY > height) {
          icon.speedY = -icon.speedY;
          newY = icon.y + icon.speedY;
        }
        
        return {
          ...icon,
          x: newX,
          y: newY,
        };
      });
      
      frameRef.current = requestAnimationFrame(updatePositions);
    };
    
    frameRef.current = requestAnimationFrame(updatePositions);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [iconCount, icons]);
  
  return (
    <div 
      ref={canvasRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {iconsRef.current.map((icon) => (
        <div
          key={icon.id}
          className="absolute text-indigo-500 dark:text-indigo-400 opacity-10"
          style={{
            left: `${icon.x}px`,
            top: `${icon.y}px`,
            transform: `scale(${icon.size})`,
            opacity: icon.opacity,
            transition: 'transform 0.5s ease-out',
          }}
        >
          {icon.icon}
        </div>
      ))}
    </div>
  );
} 