'use client';

import { useState } from 'react';
import { useRegistration } from '@/contexts/RegistrationContext';
import BaseForm from '../../components/forms/BaseForm';
import { FormInput, FormSelect } from '../../components/forms/FormInputs';
import { BasicInfo, FormErrors } from '@/types/registration';

interface FormData extends BasicInfo {
  height: string;
  weight: string;
  preferredFoot: 'left' | 'right' | 'both';
}

const footOptions = [
  { value: 'right', label: 'Right' },
  { value: 'left', label: 'Left' },
  { value: 'both', label: 'Both' },
];

export default function BasicInfoForm() {
  const { updateRegistrationData, registrationData, errors: contextErrors, setErrors: setContextErrors } = useRegistration();
  const [formData, setFormData] = useState<FormData>({
    fullName: registrationData.basicInfo?.fullName || '',
    dateOfBirth: registrationData.basicInfo?.dateOfBirth || '',
    nationality: registrationData.basicInfo?.nationality || '',
    email: registrationData.basicInfo?.email || '',
    phone: registrationData.basicInfo?.phone || '',
    height: String(registrationData.footballProfile?.height || ''),
    weight: String(registrationData.footballProfile?.weight || ''),
    preferredFoot: registrationData.footballProfile?.preferredFoot || 'right',
    address: registrationData.basicInfo?.address || {
      country: ''
    }
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const today = new Date();
    const minAge = 12;
    const maxAge = 50;

    // Basic Info Validation
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < minAge || age > maxAge) {
        newErrors.dateOfBirth = `Age must be between ${minAge} and ${maxAge} years`;
      }
    }

    if (!formData.nationality) {
      newErrors.nationality = 'Nationality is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Football Profile Validation
    const height = Number(formData.height);
    if (isNaN(height) || height < 100 || height > 250) {
      newErrors.height = 'Height must be between 100 and 250 cm';
    }

    const weight = Number(formData.weight);
    if (isNaN(weight) || weight < 30 || weight > 150) {
      newErrors.weight = 'Weight must be between 30 and 150 kg';
    }

    if (!formData.address?.country) {
      newErrors.address = { country: 'Country is required' };
    }

    setContextErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested object updates (e.g., address.country)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof FormData],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear context error
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setContextErrors(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: undefined
        }
      }));
    } else {
      setContextErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    updateRegistrationData({
      basicInfo: {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      },
      footballProfile: {
        height: Number(formData.height),
        weight: Number(formData.weight),
        preferredFoot: formData.preferredFoot,
        position: registrationData.footballProfile?.position || '',
        experienceLevel: registrationData.footballProfile?.experienceLevel || 'amateur'
      }
    });
  };

  return (
    <BaseForm onSubmit={handleSubmit} isValid={Object.keys(contextErrors).length === 0}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          error={contextErrors.fullName as string}
          required
          placeholder="Enter your full name"
          className="md:col-span-2"
        />

        <FormInput
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          error={contextErrors.dateOfBirth as string}
          required
        />

        <FormInput
          label="Nationality"
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
          error={contextErrors.nationality as string}
          required
          placeholder="Enter your nationality"
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={contextErrors.email as string}
          required
          placeholder="Enter your email"
        />

        <FormInput
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone || ''}
          onChange={handleChange}
          error={contextErrors.phone as string}
          placeholder="Enter your phone number"
        />

        <FormInput
          label="Country"
          name="address.country"
          value={formData.address?.country || ''}
          onChange={handleChange}
          error={contextErrors.address?.country as string}
          required
          placeholder="Enter your country"
        />

        <FormInput
          label="Height (cm)"
          name="height"
          type="number"
          value={formData.height}
          onChange={handleChange}
          error={contextErrors.height as string}
          required
          placeholder="Enter your height in centimeters"
        />

        <FormInput
          label="Weight (kg)"
          name="weight"
          type="number"
          value={formData.weight}
          onChange={handleChange}
          error={contextErrors.weight as string}
          required
          placeholder="Enter your weight in kilograms"
        />

        <FormSelect
          label="Preferred Foot"
          name="preferredFoot"
          value={formData.preferredFoot}
          onChange={handleChange}
          options={footOptions}
          required
        />
      </div>
    </BaseForm>
  );
} 