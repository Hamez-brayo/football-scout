import { useState, useEffect } from 'react'
import { User, PhysicalAttributes, FootballProfile, Availability, MediaItem, Achievement, SocialLinks, PrivacySettings } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

interface ProfileData {
  user: User
  physicalAttributes: PhysicalAttributes
  footballProfile: FootballProfile
  availability: Availability
  media: MediaItem[]
  achievements: Achievement[]
  socialLinks: SocialLinks
  privacySettings: PrivacySettings
}

import { apiClient } from '@/lib/apiClient';

export function useProfile() {
  const { user, isAuthenticated, tokenLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    if (!user?.uid) {
      setError('No user authenticated')
      setLoading(false)
      return
    }
    try {
      const data = await apiClient(`/api/users/${user.uid}/profile`);
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  const updateProfile = async (updates: Partial<ProfileData>) => {
    if (!user?.uid) {
      throw new Error('No user authenticated')
    }

    try {
      await apiClient(`/api/users/${user.uid}/profile`, {
        method: 'PUT',
        body: updates,
      });
      await fetchProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }

  useEffect(() => {
    if (user?.uid && isAuthenticated && !tokenLoading) {
      fetchProfile();
    }
  }, [user?.uid, isAuthenticated, tokenLoading]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile: fetchProfile,
  }
} 