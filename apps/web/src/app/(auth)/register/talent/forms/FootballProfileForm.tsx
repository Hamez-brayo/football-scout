import { useState } from 'react';
import { useRegistration } from '@/contexts/RegistrationContext';
import BaseForm from '../../components/forms/BaseForm';
import { FormInput, FormSelect, FormTextArea } from '../../components/forms/FormInputs';

interface FormData {
  currentClub: string;
  position: string;
  secondaryPositions: string;
  playingStyle: string;
  experienceLevel: string;
  achievements: string;
}

const positionOptions = [
  { value: 'goalkeeper', label: 'Goalkeeper' },
  { value: 'defender', label: 'Defender' },
  { value: 'midfielder', label: 'Midfielder' },
  { value: 'forward', label: 'Forward' },
];

const experienceLevelOptions = [
  { value: 'amateur', label: 'Amateur' },
  { value: 'semi-professional', label: 'Semi-Professional' },
  { value: 'professional', label: 'Professional' },
  { value: 'youth', label: 'Youth Academy' },
];

const playingStyleOptions = [
  { value: 'attacking', label: 'Attacking' },
  { value: 'defensive', label: 'Defensive' },
  { value: 'possession', label: 'Possession-based' },
  { value: 'counter-attacking', label: 'Counter-attacking' },
  { value: 'all-round', label: 'All-round' },
];

export default function FootballProfileForm() {
  const { updateRegistrationData, registrationData } = useRegistration();
  const [formData, setFormData] = useState<FormData>({
    currentClub: registrationData.footballProfile?.currentClub || '',
    position: registrationData.footballProfile?.position || '',
    secondaryPositions: registrationData.footballProfile?.secondaryPositions || '',
    playingStyle: registrationData.footballProfile?.playingStyle || '',
    experienceLevel: registrationData.footballProfile?.experienceLevel || '',
    achievements: registrationData.footballProfile?.achievements || '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.position) {
      newErrors.position = 'Primary position is required';
    }

    if (!formData.experienceLevel) {
      newErrors.experienceLevel = 'Experience level is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    updateRegistrationData({
      footballProfile: formData
    });
  };

  return (
    <BaseForm onSubmit={handleSubmit} isValid={Object.keys(errors).length === 0}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput
          label="Current Club"
          name="currentClub"
          value={formData.currentClub}
          onChange={handleChange}
          placeholder="Enter your current club (if any)"
          className="md:col-span-2"
        />

        <FormSelect
          label="Primary Position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          options={positionOptions}
          error={errors.position}
          required
        />

        <FormInput
          label="Secondary Positions"
          name="secondaryPositions"
          value={formData.secondaryPositions}
          onChange={handleChange}
          placeholder="e.g., Right Wing, Defensive Mid"
        />

        <FormSelect
          label="Playing Style"
          name="playingStyle"
          value={formData.playingStyle}
          onChange={handleChange}
          options={playingStyleOptions}
        />

        <FormSelect
          label="Experience Level"
          name="experienceLevel"
          value={formData.experienceLevel}
          onChange={handleChange}
          options={experienceLevelOptions}
          error={errors.experienceLevel}
          required
        />

        <FormTextArea
          label="Key Achievements"
          name="achievements"
          value={formData.achievements}
          onChange={handleChange}
          placeholder="List your key achievements, tournaments won, etc."
          className="md:col-span-2"
        />
      </div>
    </BaseForm>
  );
} 