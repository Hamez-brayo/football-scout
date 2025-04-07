'use client';

import { useState } from 'react';
import { PlayingStatus, PlayingLevel, ProfessionalFocus } from '@/types/registration';
import { useRegistration } from '@/contexts/RegistrationContext';
import { useAuth } from '@/contexts/AuthContext';

interface FootballJourneyFormProps {
  onComplete: (journeyData: any) => void;
}

export default function FootballJourneyForm({ onComplete }: FootballJourneyFormProps) {
  const { updateRegistrationData } = useRegistration();
  const { user } = useAuth();
  const [status, setStatus] = useState<PlayingStatus | null>(null);
  const [level, setLevel] = useState<PlayingLevel | null>(null);
  const [selectedFocuses, setSelectedFocuses] = useState<ProfessionalFocus[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFocusToggle = (focus: ProfessionalFocus) => {
    setSelectedFocuses(prev => {
      if (prev.includes(focus)) {
        return prev.filter(f => f !== focus);
      }
      if (prev.length < 2) {
        return [...prev, focus];
      }
      return prev;
    });
  };

  const determinePath = (focuses: ProfessionalFocus[]): 'agent' | 'club' => {
    // If only one focus is selected
    if (focuses.length === 1) {
      if (focuses[0] === 'talent_discovery') return 'agent';
      return 'club';
    }

    // If two focuses are selected
    if (focuses.length === 2) {
      if (focuses.includes('talent_discovery')) return 'club';
      return 'club';
    }

    return 'club'; // Default to club path
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.uid) {
      setError('User not found. Please try signing in again.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let journeyData;
      let path;

      if (status === 'currently_playing') {
        path = 'TALENT';
        journeyData = {
          path,
          currentStatus: 'PLAYING',
          level: level?.toUpperCase() || 'AMATEUR',
          experience: '5' // Default experience value
        };
      } else {
        if (selectedFocuses.length === 0) {
          setError('Please select at least one focus area');
          return;
        }
        
        // Convert path to uppercase for backend
        path = determinePath(selectedFocuses).toUpperCase();
        journeyData = {
          path,
          currentStatus: 'PROFESSIONAL',
          level: 'PROFESSIONAL',
          experience: '5', // Default experience value
          focuses: selectedFocuses
        };
      }

      console.log('Sending journey data:', { userId: user.uid, journeyData });

      // Call onComplete with the journey data
      onComplete({
        journey: journeyData
      });
    } catch (error) {
      console.error('Error saving journey data:', error);
      setError(error instanceof Error ? error.message : 'Failed to save journey data');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 backdrop-blur-xl bg-white/5 dark:bg-gray-900/20 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-800">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Football Journey</h2>
        <p className="text-gray-500 dark:text-gray-400">Tell us about your involvement in football</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-200 p-4 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          What best describes your current status?
        </label>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setStatus('currently_playing')}
            className={`w-full p-6 text-left rounded-xl border transition-all duration-200 ease-in-out ${
              status === 'currently_playing'
                ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-200 dark:border-indigo-800 shadow-md'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md'
            }`}
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Currently Playing</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">I am actively playing football</p>
          </button>
          <button
            type="button"
            onClick={() => setStatus('professional_role')}
            className={`w-full p-6 text-left rounded-xl border transition-all duration-200 ease-in-out ${
              status === 'professional_role'
                ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-200 dark:border-indigo-800 shadow-md'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md'
            }`}
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Professional Role</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">I work in football in a professional capacity</p>
          </button>
        </div>
      </div>

      {status === 'currently_playing' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What level do you play at?
          </label>
          <div className="space-y-4">
            {(['amateur', 'academy', 'semi_pro', 'pro'] as PlayingLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevel(lvl)}
                className={`w-full p-6 text-left rounded-xl border transition-all duration-200 ease-in-out ${
                  level === lvl
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-200 dark:border-indigo-800 shadow-md'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md'
                }`}
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {lvl.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {lvl === 'amateur' && 'Playing for fun or in local leagues'}
                  {lvl === 'academy' && 'Part of a youth or professional academy'}
                  {lvl === 'semi_pro' && 'Playing semi-professionally'}
                  {lvl === 'pro' && 'Playing professionally'}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {status === 'professional_role' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select up to 2 areas of focus
          </label>
          <div className="space-y-4">
            {(['player_development', 'team_operations', 'talent_discovery', 'club_management'] as ProfessionalFocus[]).map((focus) => (
              <button
                key={focus}
                type="button"
                onClick={() => handleFocusToggle(focus)}
                className={`w-full p-6 text-left rounded-xl border transition-all duration-200 ease-in-out ${
                  selectedFocuses.includes(focus)
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-200 dark:border-indigo-800 shadow-md'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md'
                }`}
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {focus.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {focus === 'player_development' && 'Training and developing football talent'}
                  {focus === 'team_operations' && 'Managing team logistics and operations'}
                  {focus === 'talent_discovery' && 'Scouting and recruiting players'}
                  {focus === 'club_management' && 'Overall club administration and strategy'}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-800">
        <button
          type="submit"
          disabled={
            isSubmitting ||
            !status || 
            (status === 'currently_playing' ? !level : selectedFocuses.length === 0)
          }
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 ease-in-out shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </form>
  );
} 