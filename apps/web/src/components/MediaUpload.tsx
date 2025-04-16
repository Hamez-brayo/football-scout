import { useState, useRef } from 'react';
import { Image, Video, X } from '@phosphor-icons/react';

interface MediaUploadProps {
  onUpload: (file: File, type: string) => Promise<void>;
  onRemove: () => void;
  previewUrl?: string;
  type?: 'image' | 'video';
}

export function MediaUpload({ onUpload, onRemove, previewUrl, type = 'image' }: MediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Please upload an image or video file');
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(file, file.type.startsWith('image/') ? 'image' : 'video');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <div
        className={`w-full h-48 rounded-lg border-2 border-dashed flex items-center justify-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {previewUrl ? (
          <div className="relative w-full h-full">
            {type === 'image' ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <video
                src={previewUrl}
                className="w-full h-full object-cover rounded-lg"
                controls
              />
            )}
            <button
              type="button"
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="text-center">
            {type === 'image' ? (
              <Image size={32} className="mx-auto mb-2 text-gray-400" />
            ) : (
              <Video size={32} className="mx-auto mb-2 text-gray-400" />
            )}
            <p className="text-sm text-gray-500">
              Drag and drop {type} here, or click to select
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {type === 'image' ? 'PNG, JPG, GIF up to 10MB' : 'MP4, MOV up to 100MB'}
            </p>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={type === 'image' ? 'image/*' : 'video/*'}
        onChange={handleFileInput}
      />
      {isUploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="text-white">Uploading...</div>
        </div>
      )}
    </div>
  );
} 