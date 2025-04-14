'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/useProfile';
import { User, Trophy, Calendar, MapPin, VideoCamera, ChartLine, Share, Gear, ArrowLeft } from '@phosphor-icons/react';
import Link from 'next/link';

interface ProfileFormData {
  basicInfo: {
    firstName: string;
    lastName: string;
    nickname?: string;
    dateOfBirth: string;
    nationality: string;
    languages: string[];
    currentLocation: string;
    bio: string;
  };
  physicalAttributes: {
    height: number;
    weight: number;
    fitnessLevel: number;
    preferredFoot: 'left' | 'right' | 'both';
  };
  footballProfile: {
    primaryPosition: string;
    secondaryPositions: string[];
    currentClub: string;
    previousClubs: string[];
    experience: string;
    achievements: string[];
  };
  availability: {
    isAvailableForTrials: boolean;
    preferredRegions: string[];
    notice: string;
  };
  media: {
    profilePhoto: string;
    coverPhoto?: string;
    highlightVideo?: string;
    matchFootage: string[];
  };
  socialMedia: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

export default function EditProfilePage() {
  const router = useRouter();
  const { profile, loading, error, updateProfile } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    basicInfo: {
      firstName: '',
      lastName: '',
      nickname: '',
      dateOfBirth: '',
      nationality: '',
      languages: [],
      currentLocation: '',
      bio: '',
    },
    physicalAttributes: {
      height: 0,
      weight: 0,
      fitnessLevel: 0,
      preferredFoot: 'right',
    },
    footballProfile: {
      primaryPosition: '',
      secondaryPositions: [],
      currentClub: '',
      previousClubs: [],
      experience: '',
      achievements: [],
    },
    availability: {
      isAvailableForTrials: false,
      preferredRegions: [],
      notice: '',
    },
    media: {
      profilePhoto: '',
      coverPhoto: '',
      highlightVideo: '',
      matchFootage: [],
    },
    socialMedia: {
      instagram: '',
      twitter: '',
      youtube: '',
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        basicInfo: {
          firstName: profile.user.firstName || '',
          lastName: profile.user.lastName || '',
          nickname: profile.user.nickname || '',
          dateOfBirth: profile.user.dateOfBirth || '',
          nationality: profile.user.nationality || '',
          languages: profile.user.languages || [],
          currentLocation: profile.user.currentLocation || '',
        },
        physicalAttributes: {
          height: profile.physicalAttributes?.height || 0,
          weight: profile.physicalAttributes?.weight || 0,
          fitnessLevel: profile.physicalAttributes?.fitnessLevel || 0,
          preferredFoot: profile.physicalAttributes?.preferredFoot || 'right',
        },
        footballProfile: {
          primaryPosition: profile.footballProfile?.primaryPosition || '',
          secondaryPositions: profile.footballProfile?.secondaryPositions || [],
          currentClub: profile.footballProfile?.currentClub || '',
          previousClubs: profile.footballProfile?.previousClubs || [],
          experience: profile.footballProfile?.experience || '',
          achievements: profile.footballProfile?.achievements || [],
        },
        availability: {
          isAvailableForTrials: profile.availability?.isAvailableForTrials || false,
          preferredRegions: profile.availability?.preferredRegions || [],
          notice: profile.availability?.notice || '',
        },
        media: {
          profilePhoto: profile.media?.profilePhoto || '',
          coverPhoto: profile.media?.coverPhoto || '',
          highlightVideo: profile.media?.highlightVideo || '',
          matchFootage: profile.media?.matchFootage || [],
        },
        socialMedia: {
          instagram: profile.socialMedia?.instagram || '',
          twitter: profile.socialMedia?.twitter || '',
          youtube: profile.socialMedia?.youtube || '',
        },
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile(formData);
      router.push('/talent/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (section: keyof ProfileFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const inputClasses = "mt-1 block w-full px-4 py-3 rounded-xl border-0 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 backdrop-blur-xl shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-all duration-200 ease-in-out";
  const labelClasses = "block text-sm font-medium leading-6 text-gray-100 mb-2";
  const sectionClasses = "bg-gray-800/50 rounded-lg p-6 space-y-6";

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/talent/profile" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
          </div>
          <button
            type="submit"
            form="profile-form"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className={sectionClasses}>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className={labelClasses}>First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.basicInfo.firstName}
                  onChange={(e) => handleInputChange('basicInfo', 'firstName', e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className={labelClasses}>Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.basicInfo.lastName}
                  onChange={(e) => handleInputChange('basicInfo', 'lastName', e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label htmlFor="nickname" className={labelClasses}>Nickname (Optional)</label>
                <input
                  type="text"
                  id="nickname"
                  value={formData.basicInfo.nickname}
                  onChange={(e) => handleInputChange('basicInfo', 'nickname', e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className={labelClasses}>Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={formData.basicInfo.dateOfBirth}
                  onChange={(e) => handleInputChange('basicInfo', 'dateOfBirth', e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label htmlFor="nationality" className={labelClasses}>Nationality</label>
                <input
                  type="text"
                  id="nationality"
                  value={formData.basicInfo.nationality}
                  onChange={(e) => handleInputChange('basicInfo', 'nationality', e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label htmlFor="currentLocation" className={labelClasses}>Current Location</label>
                <input
                  type="text"
                  id="currentLocation"
                  value={formData.basicInfo.currentLocation}
                  onChange={(e) => handleInputChange('basicInfo', 'currentLocation', e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="bio" className={labelClasses}>Bio</label>
                <textarea
                  id="bio"
                  value={formData.basicInfo.bio}
                  onChange={(e) => handleInputChange('basicInfo', 'bio', e.target.value)}
                  className={`${inputClasses} h-32 resize-none`}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Physical Attributes */}
          <div className={sectionClasses}>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Physical Attributes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="height" className={labelClasses}>Height (cm)</label>
                <input
                  type="number"
                  id="height"
                  value={formData.physicalAttributes.height}
                  onChange={(e) => handleInputChange('physicalAttributes', 'height', parseInt(e.target.value))}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label htmlFor="weight" className={labelClasses}>Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  value={formData.physicalAttributes.weight}
                  onChange={(e) => handleInputChange('physicalAttributes', 'weight', parseInt(e.target.value))}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label htmlFor="preferredFoot" className={labelClasses}>Preferred Foot</label>
                <select
                  id="preferredFoot"
                  value={formData.physicalAttributes.preferredFoot}
                  onChange={(e) => handleInputChange('physicalAttributes', 'preferredFoot', e.target.value)}
                  className={inputClasses}
                  required
                >
                  <option value="right">Right</option>
                  <option value="left">Left</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label htmlFor="fitnessLevel" className={labelClasses}>Fitness Level</label>
                <input
                  type="range"
                  id="fitnessLevel"
                  min="0"
                  max="100"
                  value={formData.physicalAttributes.fitnessLevel}
                  onChange={(e) => handleInputChange('physicalAttributes', 'fitnessLevel', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-right text-sm text-gray-400">
                  {formData.physicalAttributes.fitnessLevel}%
                </div>
              </div>
            </div>
          </div>

          {/* Football Profile */}
          <div className={sectionClasses}>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Football Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="primaryPosition" className={labelClasses}>Primary Position</label>
                <select
                  id="primaryPosition"
                  value={formData.footballProfile.primaryPosition}
                  onChange={(e) => handleInputChange('footballProfile', 'primaryPosition', e.target.value)}
                  className={inputClasses}
                  required
                >
                  <option value="">Select position</option>
                  <option value="Goalkeeper">Goalkeeper</option>
                  <option value="Defender">Defender</option>
                  <option value="Midfielder">Midfielder</option>
                  <option value="Forward">Forward</option>
                </select>
              </div>
              <div>
                <label htmlFor="currentClub" className={labelClasses}>Current Club</label>
                <input
                  type="text"
                  id="currentClub"
                  value={formData.footballProfile.currentClub}
                  onChange={(e) => handleInputChange('footballProfile', 'currentClub', e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="experience" className={labelClasses}>Experience</label>
                <textarea
                  id="experience"
                  value={formData.footballProfile.experience}
                  onChange={(e) => handleInputChange('footballProfile', 'experience', e.target.value)}
                  className={`${inputClasses} h-32 resize-none`}
                  placeholder="Describe your football experience..."
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className={sectionClasses}>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <VideoCamera className="h-5 w-5" />
              Media
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="profilePhoto" className={labelClasses}>Profile Photo URL</label>
                <input
                  type="url"
                  id="profilePhoto"
                  value={formData.media.profilePhoto}
                  onChange={(e) => handleInputChange('media', 'profilePhoto', e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label htmlFor="coverPhoto" className={labelClasses}>Cover Photo URL (Optional)</label>
                <input
                  type="url"
                  id="coverPhoto"
                  value={formData.media.coverPhoto}
                  onChange={(e) => handleInputChange('media', 'coverPhoto', e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="highlightVideo" className={labelClasses}>Highlight Video URL (Optional)</label>
                <input
                  type="url"
                  id="highlightVideo"
                  value={formData.media.highlightVideo}
                  onChange={(e) => handleInputChange('media', 'highlightVideo', e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className={sectionClasses}>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Share className="h-5 w-5" />
              Social Media
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="instagram" className={labelClasses}>Instagram (Optional)</label>
                <input
                  type="url"
                  id="instagram"
                  value={formData.socialMedia.instagram}
                  onChange={(e) => handleInputChange('socialMedia', 'instagram', e.target.value)}
                  className={inputClasses}
                  placeholder="https://instagram.com/username"
                />
              </div>
              <div>
                <label htmlFor="twitter" className={labelClasses}>Twitter (Optional)</label>
                <input
                  type="url"
                  id="twitter"
                  value={formData.socialMedia.twitter}
                  onChange={(e) => handleInputChange('socialMedia', 'twitter', e.target.value)}
                  className={inputClasses}
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div>
                <label htmlFor="youtube" className={labelClasses}>YouTube (Optional)</label>
                <input
                  type="url"
                  id="youtube"
                  value={formData.socialMedia.youtube}
                  onChange={(e) => handleInputChange('socialMedia', 'youtube', e.target.value)}
                  className={inputClasses}
                  placeholder="https://youtube.com/channel"
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className={sectionClasses}>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Availability
            </h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isAvailableForTrials"
                  checked={formData.availability.isAvailableForTrials}
                  onChange={(e) => handleInputChange('availability', 'isAvailableForTrials', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label htmlFor="isAvailableForTrials" className="text-sm text-gray-100">
                  Available for Trials
                </label>
              </div>
              <div>
                <label htmlFor="notice" className={labelClasses}>Notice Period</label>
                <input
                  type="text"
                  id="notice"
                  value={formData.availability.notice}
                  onChange={(e) => handleInputChange('availability', 'notice', e.target.value)}
                  className={inputClasses}
                  placeholder="e.g., 2 weeks notice required"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 