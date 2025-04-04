'use client';

import React, { useState } from 'react';
import { useRegistration } from '@/contexts/RegistrationContext';
import { BaseFormProps } from '@/types/registration';

export default function BaseForm({
  children,
  onSubmit,
  isValid = true,
  showNavigation = true
}: BaseFormProps) {
  const {
    currentStep,
    totalSteps,
    goToNextStep,
    goToPreviousStep,
    currentStepData,
    progress
  } = useRegistration();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(e);
      await goToNextStep();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step Title and Description */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {currentStepData?.title}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {currentStepData?.description}
        </p>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {children}
      </div>

      {/* Navigation Buttons */}
      {showNavigation && (
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={goToPreviousStep}
            disabled={currentStep === 0 || isSubmitting}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            } border border-gray-300 dark:border-gray-600`}
          >
            Previous
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              !isValid || isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors duration-200`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </div>
            ) : currentStep === totalSteps - 1 ? (
              'Complete Registration'
            ) : (
              'Continue'
            )}
          </button>
        </div>
      )}
    </form>
  );
} 