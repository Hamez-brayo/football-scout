'use client';

import { useState } from 'react';
import { useRegistration } from '@/contexts/RegistrationContext';

interface MediaUploadProps {
  onComplete: () => void;
}

export default function MediaUpload({ onComplete }: MediaUploadProps) {
  const { updateRegistrationData } = useRegistration();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profilePicture' | 'coverPhoto' | 'documents' | 'videos') => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // TODO: Implement actual file upload logic here
      // For now, we'll just simulate a successful upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      const fileUrls = Array.from(files).map(file => URL.createObjectURL(file));
      
      updateRegistrationData({
        media: {
          [type]: type === 'documents' || type === 'videos' ? fileUrls : fileUrls[0]
        }
      });

      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Profile Picture
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, 'profilePicture')}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100
              dark:file:bg-indigo-900/20 dark:file:text-indigo-400"
            disabled={isUploading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Cover Photo
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, 'coverPhoto')}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100
              dark:file:bg-indigo-900/20 dark:file:text-indigo-400"
            disabled={isUploading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Documents (CV, Certificates, etc.)
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            multiple
            onChange={(e) => handleFileUpload(e, 'documents')}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100
              dark:file:bg-indigo-900/20 dark:file:text-indigo-400"
            disabled={isUploading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Videos (Highlights, Matches, etc.)
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={(e) => handleFileUpload(e, 'videos')}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100
              dark:file:bg-indigo-900/20 dark:file:text-indigo-400"
            disabled={isUploading}
          />
        </div>
      </div>

      {isUploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onComplete}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Complete Registration
        </button>
      </div>
    </div>
  );
} 