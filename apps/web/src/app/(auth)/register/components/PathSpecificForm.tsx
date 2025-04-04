'use client';

import { useState } from 'react';
import { UserPath } from '@/types/registration';

interface PathSpecificFormProps {
  path: UserPath;
  onComplete: (data: any) => void;
}

export default function PathSpecificForm({ path, onComplete }: PathSpecificFormProps) {
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderPlayerForm = () => (
    <>
      <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Position
        </label>
        <select
          id="position"
          name="position"
          value={formData.position || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          required
        >
          <option value="">Select your position</option>
          <option value="goalkeeper">Goalkeeper</option>
          <option value="defender">Defender</option>
          <option value="midfielder">Midfielder</option>
          <option value="forward">Forward</option>
        </select>
      </div>

      <div>
        <label htmlFor="currentClub" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Current Club
        </label>
        <input
          type="text"
          id="currentClub"
          name="currentClub"
          value={formData.currentClub || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="preferredFoot" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Preferred Foot
        </label>
        <select
          id="preferredFoot"
          name="preferredFoot"
          value={formData.preferredFoot || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          required
        >
          <option value="">Select your preferred foot</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
          <option value="both">Both</option>
        </select>
      </div>
    </>
  );

  const renderAgentForm = () => (
    <>
      <div>
        <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Agency Name
        </label>
        <input
          type="text"
          id="agencyName"
          name="agencyName"
          value={formData.agencyName || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Years of Experience
        </label>
        <input
          type="number"
          id="yearsOfExperience"
          name="yearsOfExperience"
          value={formData.yearsOfExperience || ''}
          onChange={handleChange}
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="specialties" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Specialties (comma-separated)
        </label>
        <input
          type="text"
          id="specialties"
          name="specialties"
          value={formData.specialties || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          required
        />
      </div>
    </>
  );

  const renderClubForm = () => (
    <>
      <div>
        <label htmlFor="clubName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Club Name
        </label>
        <input
          type="text"
          id="clubName"
          name="clubName"
          value={formData.clubName || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Your Role
        </label>
        <input
          type="text"
          id="role"
          name="role"
          value={formData.role || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Department
        </label>
        <select
          id="department"
          name="department"
          value={formData.department || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          required
        >
          <option value="">Select your department</option>
          <option value="technical">Technical</option>
          <option value="scouting">Scouting</option>
          <option value="academy">Academy</option>
          <option value="management">Management</option>
          <option value="other">Other</option>
        </select>
      </div>
    </>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {path === 'player' && renderPlayerForm()}
      {path === 'agent' && renderAgentForm()}
      {path === 'club' && renderClubForm()}

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Continue
        </button>
      </div>
    </form>
  );
} 