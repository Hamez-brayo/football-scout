'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthMiddleware from '@/middleware/authMiddleware';
import { useAuth } from '@/contexts/AuthContext';

interface AgentFormData {
  fullName: string;
  companyName: string;
  licenseNumber: string;
  yearsExperience: string;
  languages: string;
  operationAreas: string;
}

export default function AgentRegistration() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<AgentFormData>({
    fullName: '',
    companyName: '',
    licenseNumber: '',
    yearsExperience: '',
    languages: '',
    operationAreas: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AuthMiddleware>
      <div className="bg-[#0f0f0f]/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Complete Your Agent Profile
          </h1>
          <p className="text-gray-400">
            Tell us about your experience and expertise
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
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
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-300">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                required
                value={formData.companyName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-300">
                License Number
              </label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                required
                value={formData.licenseNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-300">
                Years of Experience
              </label>
              <input
                type="number"
                id="yearsExperience"
                name="yearsExperience"
                required
                value={formData.yearsExperience}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="languages" className="block text-sm font-medium text-gray-300">
                Languages (comma separated)
              </label>
              <input
                type="text"
                id="languages"
                name="languages"
                required
                value={formData.languages}
                onChange={handleChange}
                placeholder="English, Spanish, French"
                className="mt-1 block w-full rounded-md bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="operationAreas" className="block text-sm font-medium text-gray-300">
                Areas of Operation
              </label>
              <textarea
                id="operationAreas"
                name="operationAreas"
                required
                value={formData.operationAreas}
                onChange={handleChange}
                rows={3}
                placeholder="List the countries/regions where you operate"
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