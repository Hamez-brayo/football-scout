import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

interface ProfileCompletionStatus {
  isComplete: boolean;
  missingFields: string[];
  completionPercentage: number;
  sections: {
    name: string;
    fields: string[];
    isComplete: boolean;
    progress: number;
  }[];
}

type ProfileUserShape = {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  nationality?: string;
  currentLocation?: string;
  footballProfile?: {
    primaryPosition?: string;
    secondaryPositions?: string[];
    strongerFoot?: string;
    currentClub?: string;
    experience?: string;
  };
  physicalAttributes?: {
    height?: number | string;
    weight?: number | string;
    speed?: number | string;
    strength?: number | string;
  };
};

export function useProfileCompletion(): ProfileCompletionStatus {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [status, setStatus] = useState<ProfileCompletionStatus>({
    isComplete: false,
    missingFields: [],
    completionPercentage: 0,
    sections: [],
  });

  useEffect(() => {
    const profileUser = (profile?.user ?? {}) as ProfileUserShape;
    const sections = [
      {
        name: 'Basic Profile',
        fields: ['Profile Picture', 'Display Name'],
        checks: [
          user?.photoURL,
          user?.displayName,
        ],
      },
      {
        name: 'Personal Information',
        fields: ['First Name', 'Last Name', 'Date of Birth', 'Nationality', 'Current Location'],
        checks: [
          profileUser.firstName,
          profileUser.lastName,
          profileUser.dateOfBirth,
          profileUser.nationality,
          profileUser.currentLocation,
        ],
      },
      {
        name: 'Football Profile',
        fields: ['Primary Position', 'Secondary Positions', 'Stronger Foot', 'Current Club', 'Playing Experience'],
        checks: [
          profileUser.footballProfile?.primaryPosition,
          profileUser.footballProfile?.secondaryPositions?.length,
          profileUser.footballProfile?.strongerFoot,
          profileUser.footballProfile?.currentClub,
          profileUser.footballProfile?.experience,
        ],
      },
      {
        name: 'Physical Attributes',
        fields: ['Height', 'Weight', 'Speed Stats', 'Strength Stats'],
        checks: [
          profileUser.physicalAttributes?.height,
          profileUser.physicalAttributes?.weight,
          profileUser.physicalAttributes?.speed,
          profileUser.physicalAttributes?.strength,
        ],
      },
    ];

    const missingFields: string[] = [];
    const completedSections = sections.map((section) => {
      const sectionMissingFields = section.fields.filter((field, index) => !section.checks[index]);
      missingFields.push(...sectionMissingFields);
      const completedFieldsCount = section.fields.length - sectionMissingFields.length;
      const progress = Math.round((completedFieldsCount / section.fields.length) * 100);

      return {
        name: section.name,
        fields: sectionMissingFields,
        isComplete: sectionMissingFields.length === 0,
        progress,
      };
    });

    const totalFields = sections.reduce((sum, section) => sum + section.fields.length, 0);
    const completedFields = totalFields - missingFields.length;
    const completionPercentage = Math.round((completedFields / totalFields) * 100);

    setStatus({
      isComplete: missingFields.length === 0,
      missingFields,
      completionPercentage,
      sections: completedSections,
    });
  }, [user, profile]);

  return status;
} 