import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '',
  message = 'Hang tight...'
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div 
        className={`
          ${sizeClasses[size]}
          rounded-full
          border-gray-300
          border-t-primary
          animate-spin
        `}
      />
      <p className="text-gray-600 font-medium text-sm animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner; 