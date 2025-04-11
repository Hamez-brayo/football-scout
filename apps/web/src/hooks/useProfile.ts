import { useState, useEffect } from 'react'
import { User, PhysicalAttributes, FootballProfile, Availability, MediaItem, Achievement, SocialLinks, PrivacySettings } from '@/types'

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

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      const data = await response.json()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<ProfileData>) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      // Refresh the profile data
      await fetchProfile()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile: fetchProfile,
  }
} 