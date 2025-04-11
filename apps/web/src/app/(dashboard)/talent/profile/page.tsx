'use client'

import { useState } from 'react'
import { User, Trophy, Calendar, MapPin, VideoCamera, ChartLine, Share, Gear } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useProfile } from '@/hooks/useProfile'

// Profile Header Component
const ProfileHeader = ({ user }: { user: any }) => {
  return (
    <div className="relative">
      {/* Cover Photo */}
      <div className="h-48 bg-gray-800 rounded-t-lg">
        {user.coverPhoto ? (
          <img src={user.coverPhoto} alt="Cover" className="w-full h-full object-cover rounded-t-lg" />
        ) : (
          <div className="w-full h-full bg-gray-800 rounded-t-lg" />
        )}
      </div>
      
      {/* Profile Info */}
      <div className="relative px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            {/* Profile Photo */}
            <div className="h-32 w-32 rounded-full bg-gray-700 border-4 border-gray-900 overflow-hidden">
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-700" />
              )}
            </div>
            
            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">
                {user.firstName} {user.lastName}
                {user.nickname && <span className="text-gray-400"> "{user.nickname}"</span>}
              </h1>
              <p className="text-gray-400">{user.footballProfile?.primaryPosition}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="px-2 py-1 text-xs rounded-full bg-green-900/50 text-green-300">
                  {user.physicalAttributes?.preferredFoot} Footed
                </span>
                {user.availability?.isAvailableForTrials && (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-900/50 text-blue-300">
                    Available for Trials
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Section Component
const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
  <div className="bg-gray-800/50 rounded-lg p-6">
    <div className="flex items-center space-x-2 mb-4">
      <Icon className="h-5 w-5 text-gray-400" />
      <h2 className="text-lg font-semibold text-white">{title}</h2>
    </div>
    {children}
  </div>
)

export default function ProfilePage() {
  const { profile, loading, error } = useProfile()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500">Error loading profile</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <ProfileHeader user={profile.user} />

        {/* Main Content Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Section title="Personal Information" icon={User}>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Full Name</label>
                <p className="text-white">{profile.user.firstName} {profile.user.lastName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Date of Birth</label>
                <p className="text-white">
                  {new Date(profile.user.dateOfBirth).toLocaleDateString()} 
                  ({Math.floor((new Date().getTime() - new Date(profile.user.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))} years)
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Nationality</label>
                <p className="text-white">{profile.user.nationality}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Languages</label>
                <div className="flex space-x-2 mt-1">
                  {profile.user.languages.map((lang, index) => (
                    <span key={index} className="px-2 py-1 text-xs rounded-full bg-gray-700 text-white">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Physical Attributes */}
          <Section title="Physical Attributes" icon={User}>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Height</label>
                <p className="text-white">{profile.physicalAttributes.height} cm</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Weight</label>
                <p className="text-white">{profile.physicalAttributes.weight} kg</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Fitness Level</label>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${profile.physicalAttributes.fitnessLevel}%` }}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Football Information */}
          <Section title="Football Information" icon={Trophy}>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Primary Position</label>
                <p className="text-white">{profile.footballProfile.primaryPosition}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Secondary Positions</label>
                <div className="flex space-x-2 mt-1">
                  {profile.footballProfile.secondaryPositions.map((pos, index) => (
                    <span key={index} className="px-2 py-1 text-xs rounded-full bg-gray-700 text-white">
                      {pos}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400">Current Club</label>
                <p className="text-white">{profile.footballProfile.currentClub}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Previous Clubs</label>
                <div className="flex space-x-2 mt-1">
                  {profile.footballProfile.previousClubs.map((club, index) => (
                    <span key={index} className="px-2 py-1 text-xs rounded-full bg-gray-700 text-white">
                      {club}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Availability */}
          <Section title="Availability" icon={Calendar}>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Status</label>
                <p className={profile.availability.isAvailableForTrials ? "text-green-400" : "text-red-400"}>
                  {profile.availability.isAvailableForTrials ? "Available for Trials" : "Not Available"}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Preferred Regions</label>
                <div className="flex space-x-2 mt-1">
                  {profile.availability.preferredRegions.map((region, index) => (
                    <span key={index} className="px-2 py-1 text-xs rounded-full bg-gray-700 text-white">
                      {region}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400">Willing to Relocate</label>
                <p className="text-white">{profile.availability.willingToRelocate ? "Yes" : "No"}</p>
              </div>
            </div>
          </Section>

          {/* Media */}
          <Section title="Media" icon={VideoCamera}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {profile.media.slice(0, 2).map((item) => (
                  <div key={item.id} className="aspect-video bg-gray-700 rounded-lg overflow-hidden">
                    {item.type === 'video' ? (
                      <video src={item.url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
              {profile.media.length > 2 && (
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                  View All Media ({profile.media.length})
                </button>
              )}
            </div>
          </Section>

          {/* Achievements */}
          <Section title="Achievements" icon={Trophy}>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Recent Achievements</label>
                <ul className="mt-2 space-y-2">
                  {profile.achievements.map((achievement) => (
                    <li key={achievement.id} className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-yellow-400" />
                      <span className="text-white">{achievement.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
} 