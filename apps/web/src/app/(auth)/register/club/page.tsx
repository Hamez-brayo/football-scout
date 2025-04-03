'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthMiddleware from '@/middleware/authMiddleware';
import { useAuth } from '@/contexts/AuthContext';

interface ClubFormData {
  clubName: string;
  location: string;
  league: string;
  country: string;
  registrationNumber: string;
  yearFounded: string;
  website: string;
  contactName: string;
  position: string;
  email: string;
  phone: string;
}

export default function ClubRegistration() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<ClubFormData>({
    clubName: '',
    location: '',
    league: '',
    country: '',
    registrationNumber: '',
    yearFounded: '',
    website: '',
    contactName: '',
    position: '',
    email: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Submit to backend API
      console.log('Form data:', formData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AuthMiddleware>
      <div className="bg-[#0f0f0f]/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Complete Your Club Profile
          </h1>
          <p className="text-gray-400">
            Tell us about your football club
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="clubName" className="block text-sm font-medium text-gray-300">
                Club Name
              </label>
              <input
                type="text"
                id="clubName"
                name="clubName"
                required
                value={formData.clubName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-300">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="league" className="block text-sm font-medium text-gray-300">
                League
              </label>
              <input
                type="text"
                id="league"
                name="league"
                required
                value={formData.league}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="yearFounded" className="block text-sm font-medium text-gray-300">
                Year Founded
              </label>
              <input
                type="number"
                id="yearFounded"
                name="yearFounded"
                required
                value={formData.yearFounded}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-300">
                Registration Number
              </label>
              <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                required
                value={formData.registrationNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="website" className="block text-sm font-medium text-gray-300">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2 border-t border-white/10 pt-6">
              <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
            </div>

            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-300">
                Contact Person Name
              </label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                required
                value={formData.contactName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-300">
                Position
              </label>
              <input
                type="text"
                id="position"
                name="position"
                required
                value={formData.position}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-500'
              } transition-colors`}
            >
              {isLoading ? 'Creating Profile...' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </div>
    </AuthMiddleware>
  );
} 