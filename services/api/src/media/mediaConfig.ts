import { config } from '@/config';

export type MediaPipelineConfig = {
  maxFileSizeMb: number;
  allowedMimeTypes: string[];
  maxVideoDurationSec: number;
};

export const mediaConfig: MediaPipelineConfig = {
  maxFileSizeMb: config.MEDIA_MAX_SIZE_MB,
  allowedMimeTypes: config.MEDIA_ALLOWED_TYPES,
  maxVideoDurationSec: 600,
};
