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

const API_URL = 'http://localhost:3002'

export function useProfile() {
  const { user } = useAuth()
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
      console.log('Fetching profile for user:', user.uid)
      const response = await fetch(`${API_URL}/api/users/${user.uid}/profile`, {
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Profile fetch failed:', response.status, errorData)
        throw new Error(`Failed to fetch profile: ${response.status}`)
      }

      const data = await response.json()
      console.log('Profile data received:', data)
      setProfile(data)
    } catch (err) {
      console.error('Profile fetch error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<ProfileData>) => {
    if (!user?.uid) {
      throw new Error('No user authenticated')
    }

    try {
      const response = await fetch(`${API_URL}/api/users/${user.uid}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`,
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Profile update failed:', response.status, errorData)
        throw new Error('Failed to update profile')
      }

      // Refresh the profile data
      await fetchProfile()
    } catch (err) {
      console.error('Profile update error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  useEffect(() => {
    if (user?.uid) {
      fetchProfile()
    }
  }, [user?.uid])

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile: fetchProfile,
  }
} 