import { useState } from 'react';
import { useRegistration } from '@/contexts/RegistrationContext';
import BaseForm from '../../components/forms/BaseForm';
import { FormInput, FormTextArea } from '../../components/forms/FormInputs';

interface FormData {
  profilePhoto: string;
  highlightVideo: string;
  matchFootage: string;
  certificates: string[];
  documents: string[];
  socialMedia: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  additionalInfo: string;
}

export default function MediaVerificationForm() {
  const { updateRegistrationData, registrationData } = useRegistration();
  const [formData, setFormData] = useState<FormData>({
    profilePhoto: registrationData.media?.profilePhoto || '',
    highlightVideo: registrationData.media?.highlightVideo || '',
    matchFootage: registrationData.media?.matchFootage || '',
    certificates: registrationData.media?.certificates || [],
    documents: registrationData.media?.documents || [],
    socialMedia: {
      instagram: registrationData.media?.socialMedia?.instagram || '',
      twitter: registrationData.media?.socialMedia?.twitter || '',
      youtube: registrationData.media?.socialMedia?.youtube || '',
    },
    additionalInfo: registrationData.media?.additionalInfo || '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.profilePhoto) {
      newErrors.profilePhoto = 'Profile photo is required';
    }

    // Validate social media URLs if provided
    const urlPattern = /^https?:\/\/.+/;
    if (formData.socialMedia.instagram && !urlPattern.test(formData.socialMedia.instagram)) {
      newErrors.socialMedia = { ...newErrors.socialMedia, instagram: 'Please enter a valid URL' };
    }
    if (formData.socialMedia.twitter && !urlPattern.test(formData.socialMedia.twitter)) {
      newErrors.socialMedia = { ...newErrors.socialMedia, twitter: 'Please enter a valid URL' };
    }
    if (formData.socialMedia.youtube && !urlPattern.test(formData.socialMedia.youtube)) {
      newErrors.socialMedia = { ...newErrors.socialMedia, youtube: 'Please enter a valid URL' };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialMedia.')) {
      const [_, network] = name.split('.');
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [network]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear errors when user types
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    updateRegistrationData({
      media: formData
    });
  };

  return (
    <BaseForm onSubmit={handleSubmit} isValid={Object.keys(errors).length === 0}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <FormInput
            label="Profile Photo"
            name="profilePhoto"
            type="file"
            accept="image/*"
            value={formData.profilePhoto}
            onChange={handleChange}
            error={errors.profilePhoto as string}
            required
            className="md:col-span-2"
          />

          <FormInput
            label="Highlight Video URL"
            name="highlightVideo"
            type="url"
            value={formData.highlightVideo}
            onChange={handleChange}
            placeholder="YouTube or Vimeo URL of your highlights"
            className="md:col-span-2"
          />

          <FormInput
            label="Match Footage URL"
            name="matchFootage"
            type="url"
            value={formData.matchFootage}
            onChange={handleChange}
            placeholder="Link to full match footage"
            className="md:col-span-2"
          />

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Instagram"
                name="socialMedia.instagram"
                type="url"
                value={formData.socialMedia.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/username"
              />

              <FormInput
                label="Twitter"
                name="socialMedia.twitter"
                type="url"
                value={formData.socialMedia.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/username"
              />

              <FormInput
                label="YouTube"
                name="socialMedia.youtube"
                type="url"
                value={formData.socialMedia.youtube}
                onChange={handleChange}
                placeholder="https://youtube.com/channel"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Certificates"
                name="certificates"
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={handleChange}
                placeholder="Upload relevant certificates"
              />

              <FormInput
                label="Other Documents"
                name="documents"
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={handleChange}
                placeholder="Upload any other relevant documents"
              />
            </div>
          </div>

          <FormTextArea
            label="Additional Information"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            placeholder="Any additional information you'd like to share"
            className="md:col-span-2"
          />
        </div>
      </div>
    </BaseForm>
  );
} 