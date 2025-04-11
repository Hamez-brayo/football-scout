'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRegistration } from '@/contexts/RegistrationContext';

interface PersonalInformationFormProps {
  onComplete: (data: any) => void;
}

export default function PersonalInformationForm({ onComplete }: PersonalInformationFormProps) {
  const { user } = useAuth();
  const { updateRegistrationData } = useRegistration();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    nationality: '',
    city: '',
    country: '',
    bio: ''
  });

  // Pre-populate form with user data from authentication
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.displayName || prev.fullName,
        email: user.email || prev.email,
        phoneNumber: user.phoneNumber || prev.phoneNumber
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear any previous errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.uid) {
      setError('Please sign in to continue with registration.');
      return;
    }

    setIsSubmitting(true);
    try {
      setError('');

      // Update registration context
      updateRegistrationData({
        userType: 'TALENT',
        basicInfo: {
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth,
          nationality: formData.nationality,
          email: formData.email,
          phone: formData.phoneNumber
        },
        footballProfile: {
          position: '',
          height: 0,
          weight: 0,
          preferredFoot: 'right',
          experienceLevel: 'amateur'
        },
        media: {
          profilePhoto: ''
        }
      });

      onComplete(formData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "mt-1 block w-full px-4 py-3 rounded-xl border-0 text-base text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 backdrop-blur-xl shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-all duration-200 ease-in-out";
  const labelClasses = "block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 backdrop-blur-xl bg-white/5 dark:bg-gray-900/20 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-800">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Personal Information</h2>
        <p className="text-gray-500 dark:text-gray-400">Tell us about yourself to personalize your experience</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-200 p-4 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ease-in-out ${
        isSubmitting ? 'opacity-50 animate-pulse' : ''
      }`}>
        <div className="col-span-2">
          <label htmlFor="fullName" className={labelClasses}>
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className={`${inputClasses} ${isSubmitting ? 'cursor-not-allowed' : ''}`}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClasses}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required={!user?.email}
            disabled={!!user?.email || isSubmitting}
            className={`${inputClasses} ${(!!user?.email || isSubmitting) ? 'cursor-not-allowed' : ''}`}
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className={labelClasses}>
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`${inputClasses} ${isSubmitting ? 'cursor-not-allowed' : ''}`}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label htmlFor="dateOfBirth" className={labelClasses}>
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className={`${inputClasses} ${isSubmitting ? 'cursor-not-allowed' : ''}`}
          />
        </div>

        <div>
          <label htmlFor="nationality" className={labelClasses}>
            Nationality
          </label>
          <input
            type="text"
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className={`${inputClasses} ${isSubmitting ? 'cursor-not-allowed' : ''}`}
            placeholder="Enter your nationality"
          />
        </div>

        <div>
          <label htmlFor="city" className={labelClasses}>
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className={`${inputClasses} ${isSubmitting ? 'cursor-not-allowed' : ''}`}
            placeholder="Enter your city"
          />
        </div>

        <div>
          <label htmlFor="country" className={labelClasses}>
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className={`${inputClasses} ${isSubmitting ? 'cursor-not-allowed' : ''}`}
            placeholder="Enter your country"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="bio" className={labelClasses}>
            Brief Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            disabled={isSubmitting}
            className={`${inputClasses} resize-none ${isSubmitting ? 'cursor-not-allowed' : ''}`}
            placeholder="Tell us a bit about yourself, your passion for football, and your goals..."
          />
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-800">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`relative px-6 py-3 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all duration-200 ease-in-out ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Saving...</span>
            </div>
          ) : (
            'Continue'
          )}
          {isSubmitting && (
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            </div>
          )}
        </button>
      </div>
    </form>
  );
} 