'use client';

import { useRegistration } from '@/contexts/RegistrationContext';
import { CheckIcon } from '@heroicons/react/24/solid';

export default function RegistrationProgress() {
  const { visibleSteps, currentStep, isStepComplete, progress } = useRegistration();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      {/* Overall Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Registration Progress
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <nav aria-label="Progress">
        <ol role="list" className="overflow-hidden">
          {visibleSteps.map((step, index) => (
            <li
              key={step.id}
              className={`relative ${index !== visibleSteps.length - 1 ? 'pb-8' : ''}`}
            >
              {index !== visibleSteps.length - 1 && (
                <div
                  data-testid="step-line"
                  className={`absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 ${
                    index < currentStep 
                      ? 'bg-indigo-600' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-hidden="true"
                />
              )}
              <div className="group relative flex items-center">
                <span className="flex h-9 items-center" aria-hidden="true">
                  <span
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                      isStepComplete(step.id)
                        ? 'bg-indigo-600'
                        : index === currentStep
                        ? 'border-2 border-indigo-600 bg-white dark:bg-gray-900'
                        : 'border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'
                    }`}
                  >
                    {isStepComplete(step.id) ? (
                      <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                    ) : (
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          index === currentStep ? 'bg-indigo-600' : 'bg-transparent'
                        }`}
                      />
                    )}
                  </span>
                </span>
                <div className="ml-4 min-w-0 flex flex-col">
                  <span 
                    className={`text-sm font-medium ${
                      index === currentStep 
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {step.description}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
} 