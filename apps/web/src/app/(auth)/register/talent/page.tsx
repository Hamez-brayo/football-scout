'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthMiddleware from '@/middleware/authMiddleware';
import { useAuth } from '@/contexts/AuthContext';

interface TalentFormData {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  currentClub: string;
  position: string;
  height: string;
  weight: string;
  preferredFoot: 'left' | 'right' | 'both';
}

export default function TalentRegistration() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<TalentFormData>({
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    currentClub: '',
    position: '',
    height: '',
    weight: '',
    preferredFoot: 'right',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AuthMiddleware>
      <div className="bg-[#0f0f0f]/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Complete Your Player Profile
          </h1>
          <p className="text-gray-400">
            Tell us about your football journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                required
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-300">
                Nationality
              </label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                required
                value={formData.nationality}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="currentClub" className="block text-sm font-medium text-gray-300">
                Current Club
              </label>
              <input
                type="text"
                id="currentClub"
                name="currentClub"
                value={formData.currentClub}
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
              <label htmlFor="preferredFoot" className="block text-sm font-medium text-gray-300">
                Preferred Foot
              </label>
              <select
                id="preferredFoot"
                name="preferredFoot"
                required
                value={formData.preferredFoot}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="right">Right</option>
                <option value="left">Left</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-300">
                Height (cm)
              </label>
              <input
                type="number"
                id="height"
                name="height"
                required
                value={formData.height}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-300">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                required
                value={formData.weight}
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