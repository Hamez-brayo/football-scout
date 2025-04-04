import { TalentRegistrationData, UserType } from '@/types/registration';

const STORAGE_KEY = 'football_scout_registration';

interface StoredRegistrationData {
  userType: UserType;
  currentStep: number;
  data: Partial<TalentRegistrationData>;
  lastUpdated: number;
}

export const saveRegistrationData = (
  userType: UserType,
  currentStep: number,
  data: Partial<TalentRegistrationData>
) => {
  try {
    const storageData: StoredRegistrationData = {
      userType,
      currentStep,
      data,
      lastUpdated: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
    return true;
  } catch (error) {
    console.error('Error saving registration data:', error);
    return false;
  }
};

export const loadRegistrationData = (): StoredRegistrationData | null => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) return null;

    const parsedData: StoredRegistrationData = JSON.parse(storedData);
    
    // Check if the data is older than 24 hours
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (Date.now() - parsedData.lastUpdated > twentyFourHours) {
      clearRegistrationData();
      return null;
    }

    return parsedData;
  } catch (error) {
    console.error('Error loading registration data:', error);
    return null;
  }
};

export const clearRegistrationData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing registration data:', error);
    return false;
  }
};

export const isRegistrationComplete = (data: Partial<TalentRegistrationData>): boolean => {
  // Check if all required fields are present
  const hasBasicInfo = data.basicInfo && (
    data.basicInfo.fullName &&
    data.basicInfo.dateOfBirth &&
    data.basicInfo.nationality &&
    data.basicInfo.email &&
    data.basicInfo.address?.country
  );

  const hasFootballProfile = data.footballProfile && (
    data.footballProfile.position &&
    data.footballProfile.height &&
    data.footballProfile.weight &&
    data.footballProfile.preferredFoot &&
    data.footballProfile.experienceLevel
  );

  const hasMedia = data.media && data.media.profilePhoto;

  return Boolean(hasBasicInfo && hasFootballProfile && hasMedia);
};

export const getCompletedSteps = (data: Partial<TalentRegistrationData>): string[] => {
  const completedSteps: string[] = [];

  // Check Basic Info
  if (data.basicInfo && (
    data.basicInfo.fullName &&
    data.basicInfo.dateOfBirth &&
    data.basicInfo.nationality &&
    data.basicInfo.email &&
    data.basicInfo.address?.country
  )) {
    completedSteps.push('basic-info');
  }

  // Check Football Profile
  if (data.footballProfile && (
    data.footballProfile.position &&
    data.footballProfile.height &&
    data.footballProfile.weight &&
    data.footballProfile.preferredFoot &&
    data.footballProfile.experienceLevel
  )) {
    completedSteps.push('playing-info');
  }

  // Check Achievements (optional)
  if (data.achievements && (
    (data.achievements.titles && data.achievements.titles.length > 0) ||
    (data.achievements.statistics && data.achievements.statistics.length > 0)
  )) {
    completedSteps.push('achievements');
  }

  // Check Media
  if (data.media && data.media.profilePhoto) {
    completedSteps.push('media');
  }

  return completedSteps;
};

export const getNextIncompleteStep = (data: Partial<TalentRegistrationData>): string => {
  const completedSteps = getCompletedSteps(data);
  const allSteps = ['basic-info', 'playing-info', 'achievements', 'media'];
  
  return allSteps.find(step => !completedSteps.includes(step)) || 'media';
};

export const formatRegistrationData = (data: Partial<TalentRegistrationData>): Partial<TalentRegistrationData> => {
  return {
    ...data,
    basicInfo: data.basicInfo ? {
      ...data.basicInfo,
      dateOfBirth: data.basicInfo.dateOfBirth || '',
      phone: data.basicInfo.phone || '',
      address: {
        country: data.basicInfo.address?.country || '',
        city: data.basicInfo.address?.city || '',
        street: data.basicInfo.address?.street || '',
        state: data.basicInfo.address?.state || '',
        postalCode: data.basicInfo.address?.postalCode || ''
      }
    } : undefined,
    footballProfile: data.footballProfile ? {
      ...data.footballProfile,
      currentClub: data.footballProfile.currentClub || '',
      secondaryPositions: data.footballProfile.secondaryPositions || [],
      playingStyle: data.footballProfile.playingStyle || ''
    } : undefined,
    achievements: data.achievements ? {
      ...data.achievements,
      titles: data.achievements.titles || [],
      awards: data.achievements.awards || [],
      careerHighlights: data.achievements.careerHighlights || [],
      statistics: data.achievements.statistics || []
    } : undefined,
    media: data.media ? {
      ...data.media,
      highlightVideo: data.media.highlightVideo || '',
      matchFootage: data.media.matchFootage || [],
      certificates: data.media.certificates || [],
      documents: data.media.documents || [],
      socialMedia: {
        instagram: data.media.socialMedia?.instagram || '',
        twitter: data.media.socialMedia?.twitter || '',
        youtube: data.media.socialMedia?.youtube || ''
      },
      additionalInfo: data.media.additionalInfo || ''
    } : undefined
  };
}; 