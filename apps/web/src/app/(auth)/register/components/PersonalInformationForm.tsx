'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRegistration } from '@/contexts/RegistrationContext';

interface PersonalInformationFormProps {
  onComplete: () => void;
}

export default function PersonalInformationForm({ onComplete }: PersonalInformationFormProps) {
  const { user } = useAuth();
  const { updateRegistrationData } = useRegistration();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    nationality: '',
    currentLocation: '',
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRegistrationData({ personalInfo: formData });
    onComplete();
  };

  const inputClasses = "mt-1 block w-full px-4 py-3 rounded-xl border-0 text-base text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 backdrop-blur-xl shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-all duration-200 ease-in-out";
  const labelClasses = "block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 backdrop-blur-xl bg-white/5 dark:bg-gray-900/20 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-800">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Personal Details</h2>
        <p className="text-gray-500 dark:text-gray-400">Tell us about yourself to personalize your experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            className={inputClasses}
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
            required
            className={inputClasses}
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
            className={inputClasses}
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
            className={inputClasses}
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
            className={inputClasses}
            placeholder="Enter your nationality"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="currentLocation" className={labelClasses}>
            Current Location
          </label>
          <input
            type="text"
            id="currentLocation"
            name="currentLocation"
            value={formData.currentLocation}
            onChange={handleChange}
            required
            className={inputClasses}
            placeholder="City, Country"
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
            className={`${inputClasses} resize-none`}
            placeholder="Tell us a bit about yourself, your passion for football, and your goals..."
          />
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-800">
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 ease-in-out shadow-lg hover:shadow-indigo-500/25"
        >
          Continue
        </button>
      </div>
    </form>
  );
} 