'use client';

import { useState, useEffect } from 'react';

interface TypingTextProps {
  text: string;
  typingSpeed?: number;
  className?: string;
  onComplete?: () => void;
}

export default function TypingText({ 
  text, 
  typingSpeed = 50, 
  className = '',
  onComplete
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, typingSpeed);
      
      return () => clearTimeout(timeoutId);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, typingSpeed, onComplete]);
  
  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse ml-0.5">|</span>
    </span>
  );
} 