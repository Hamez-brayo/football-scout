import React, { useEffect, useRef } from 'react';

interface FootballLoadingAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const FootballLoadingAnimation: React.FC<FootballLoadingAnimationProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const trailRef = useRef<{ x: number; y: number; size: number; opacity: number }[]>([]);

  const sizeClasses = {
    sm: { canvas: 'w-12 h-12', ball: 8 },
    md: { canvas: 'w-16 h-16', ball: 12 },
    lg: { canvas: 'w-24 h-24', ball: 16 }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { canvas: canvasSize, ball: ballSize } = sizeClasses[size];
    const width = canvas.width;
    const height = canvas.height;

    let x = width / 2;
    let y = height / 2;
    let dx = 2;
    let dy = -2;
    let gravity = 0.2;
    let bounce = 0.7;

    const drawFootball = (x: number, y: number, size: number) => {
      if (!ctx) return;

      // Draw football
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw football pattern
      ctx.beginPath();
      ctx.moveTo(x - size, y);
      ctx.lineTo(x + size, y);
      ctx.moveTo(x, y - size);
      ctx.lineTo(x, y + size);
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const drawTrail = () => {
      if (!ctx) return;

      trailRef.current.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${point.opacity})`;
        ctx.fill();
      });
    };

    const animate = () => {
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Add current position to trail
      trailRef.current.unshift({
        x,
        y,
        size: ballSize * 0.8,
        opacity: 0.8
      });

      // Limit trail length and fade out
      if (trailRef.current.length > 5) {
        trailRef.current.pop();
      }

      trailRef.current.forEach((point, index) => {
        point.opacity = 0.8 * (1 - index / trailRef.current.length);
      });

      // Draw trail
      drawTrail();

      // Update position
      x += dx;
      y += dy;
      dy += gravity;

      // Bounce off walls
      if (x + ballSize > width || x - ballSize < 0) {
        dx = -dx * bounce;
      }

      if (y + ballSize > height) {
        y = height - ballSize;
        dy = -dy * bounce;
      }

      // Draw football
      drawFootball(x, y, ballSize);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [size]);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={sizeClasses[size].ball * 20}
        height={sizeClasses[size].ball * 20}
        className={sizeClasses[size].canvas}
      />
    </div>
  );
};

export default FootballLoadingAnimation; 