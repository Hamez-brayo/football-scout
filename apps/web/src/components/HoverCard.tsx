'use client';

import { useState } from 'react';

interface HoverCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  hoverContent?: string;
  className?: string;
}

export default function HoverCard({
  title,
  description,
  icon,
  hoverContent,
  className = '',
}: HoverCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`relative rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 h-full ${
        isHovered ? 'transform -translate-y-2 shadow-xl' : ''
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        <div className={`flex items-center gap-x-3 mb-4 transition-opacity duration-300`}>
          <div className="text-indigo-600 dark:text-indigo-400 flex justify-center items-center w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        
        <div className="relative flex-grow">
          <p className={`text-base leading-7 text-gray-600 dark:text-gray-300 transition-opacity duration-300 ${
            isHovered && hoverContent ? 'opacity-0 absolute' : 'opacity-100'
          }`}>
            {description}
          </p>
          
          {hoverContent && (
            <p className={`text-base leading-7 text-gray-600 dark:text-gray-300 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0 absolute'
            }`}>
              {hoverContent}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 