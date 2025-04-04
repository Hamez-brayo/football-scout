import { useState } from 'react';
import { useRegistration } from '@/contexts/RegistrationContext';
import BaseForm from '../../components/forms/BaseForm';
import { FormInput, FormSelect, FormTextArea } from '../../components/forms/FormInputs';

interface FormData {
  technicalSkills: {
    passing: string;
    shooting: string;
    dribbling: string;
    ballControl: string;
    heading: string;
  };
  physicalAttributes: {
    speed: string;
    strength: string;
    stamina: string;
    agility: string;
    jumping: string;
  };
  mentalAttributes: {
    vision: string;
    leadership: string;
    composure: string;
    aggression: string;
    teamwork: string;
  };
  strengths: string;
  weaknesses: string;
}

const ratingOptions = [
  { value: '5', label: 'Excellent' },
  { value: '4', label: 'Very Good' },
  { value: '3', label: 'Good' },
  { value: '2', label: 'Average' },
  { value: '1', label: 'Below Average' },
];

export default function SkillsAttributesForm() {
  const { updateRegistrationData, registrationData } = useRegistration();
  const [formData, setFormData] = useState<FormData>({
    technicalSkills: {
      passing: registrationData.skills?.technicalSkills?.passing || '',
      shooting: registrationData.skills?.technicalSkills?.shooting || '',
      dribbling: registrationData.skills?.technicalSkills?.dribbling || '',
      ballControl: registrationData.skills?.technicalSkills?.ballControl || '',
      heading: registrationData.skills?.technicalSkills?.heading || '',
    },
    physicalAttributes: {
      speed: registrationData.skills?.physicalAttributes?.speed || '',
      strength: registrationData.skills?.physicalAttributes?.strength || '',
      stamina: registrationData.skills?.physicalAttributes?.stamina || '',
      agility: registrationData.skills?.physicalAttributes?.agility || '',
      jumping: registrationData.skills?.physicalAttributes?.jumping || '',
    },
    mentalAttributes: {
      vision: registrationData.skills?.mentalAttributes?.vision || '',
      leadership: registrationData.skills?.mentalAttributes?.leadership || '',
      composure: registrationData.skills?.mentalAttributes?.composure || '',
      aggression: registrationData.skills?.mentalAttributes?.aggression || '',
      teamwork: registrationData.skills?.mentalAttributes?.teamwork || '',
    },
    strengths: registrationData.skills?.strengths || '',
    weaknesses: registrationData.skills?.weaknesses || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const [category, attribute] = name.split('.');
    
    if (attribute) {
      setFormData(prev => ({
        ...prev,
        [category]: {
          ...prev[category as keyof typeof prev],
          [attribute]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    updateRegistrationData({
      skills: formData
    });
  };

  const renderAttributeSection = (title: string, attributes: Record<string, string>, category: string) => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(attributes).map(([key, value]) => (
          <FormSelect
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            name={`${category}.${key}`}
            value={value}
            onChange={handleChange}
            options={ratingOptions}
          />
        ))}
      </div>
    </div>
  );

  return (
    <BaseForm onSubmit={handleSubmit} isValid={true}>
      <div className="space-y-8">
        {renderAttributeSection('Technical Skills', formData.technicalSkills, 'technicalSkills')}
        {renderAttributeSection('Physical Attributes', formData.physicalAttributes, 'physicalAttributes')}
        {renderAttributeSection('Mental Attributes', formData.mentalAttributes, 'mentalAttributes')}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormTextArea
            label="Key Strengths"
            name="strengths"
            value={formData.strengths}
            onChange={handleChange}
            placeholder="Describe your main strengths as a player"
          />
          
          <FormTextArea
            label="Areas for Improvement"
            name="weaknesses"
            value={formData.weaknesses}
            onChange={handleChange}
            placeholder="Describe areas you'd like to improve"
          />
        </div>
      </div>
    </BaseForm>
  );
} 