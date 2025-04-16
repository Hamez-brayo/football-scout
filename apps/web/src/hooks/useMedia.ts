import { useState } from 'react';

interface MediaUploadResponse {
  id: string;
  url: string;
  type: string;
  title?: string;
  description?: string;
}

export function useMedia() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadMedia = async (file: File, type: 'image' | 'video', title?: string, description?: string): Promise<MediaUploadResponse> => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      if (title) formData.append('title', title);
      if (description) formData.append('description', description);

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload media');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteMedia = async (mediaId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/media/${mediaId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete media');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete media');
      throw err;
    }
  };

  return {
    uploadMedia,
    deleteMedia,
    isUploading,
    error,
  };
} 