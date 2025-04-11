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
    const sections = [
      {
        name: 'Basic Profile',
        fields: ['Profile Picture', 'Display Name'],
        checks: [
          user?.photoURL,
          user?.displayName
        ]
      },
      {
        name: 'Personal Information',
        fields: ['First Name', 'Last Name', 'Date of Birth', 'Nationality', 'Current Location'],
        checks: [
          profile?.user?.firstName,
          profile?.user?.lastName,
          profile?.user?.dateOfBirth,
          profile?.user?.nationality,
          profile?.user?.currentLocation
        ]
      },
      {
        name: 'Football Profile',
        fields: ['Primary Position', 'Secondary Positions', 'Stronger Foot', 'Current Club', 'Playing Experience'],
        checks: [
          profile?.user?.footballProfile?.primaryPosition,
          profile?.user?.footballProfile?.secondaryPositions?.length > 0,
          profile?.user?.footballProfile?.strongerFoot,
          profile?.user?.footballProfile?.currentClub,
          profile?.user?.footballProfile?.experience
        ]
      },
      {
        name: 'Physical Attributes',
        fields: ['Height', 'Weight', 'Speed Stats', 'Strength Stats'],
        checks: [
          profile?.user?.physicalAttributes?.height,
          profile?.user?.physicalAttributes?.weight,
          profile?.user?.physicalAttributes?.speed,
          profile?.user?.physicalAttributes?.strength
        ]
      }
    ];

    const missingFields: string[] = [];
    const completedSections = sections.map(section => {
      const sectionMissingFields = section.fields.filter((field, index) => !section.checks[index]);
      missingFields.push(...sectionMissingFields);
      const completedFieldsCount = section.fields.length - sectionMissingFields.length;
      const progress = Math.round((completedFieldsCount / section.fields.length) * 100);
      
      return {
        name: section.name,
        fields: sectionMissingFields,
        isComplete: sectionMissingFields.length === 0,
        progress
      };
    });

    // Calculate completion percentage based on all required fields
    const totalFields = sections.reduce((sum, section) => sum + section.fields.length, 0);
    const completedFields = totalFields - missingFields.length;
    const completionPercentage = Math.round((completedFields / totalFields) * 100);

    setStatus({
      isComplete: missingFields.length === 0,
      missingFields,
      completionPercentage,
      sections: completedSections
    });
  }, [user, profile]);

  return status;
} 