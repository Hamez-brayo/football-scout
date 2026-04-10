import type { MediaRecord } from '@vysion/shared';

/**
 * UploadService defines a storage-agnostic media contract.
 *
 * Processing flow specification:
 * 1) upload: accept raw file bytes from API boundary.
 * 2) validate: enforce MIME, size, and duration constraints.
 * 3) compress: apply media-specific optimization/transcoding.
 * 4) store: persist the processed object via a storage adapter.
 * 5) update DB record status: write READY/FAILED and metadata.
 *
 * Storage adapter requirement:
 * - Firebase Storage is the default adapter implementation.
 * - Adapter binding MUST remain swappable (e.g. S3, Azure Blob) without
 *   changing this interface or upstream controller/service contracts.
 */
export interface UploadService {
  uploadMedia(file: Buffer, ownerId: string, type: 'image' | 'video'): Promise<MediaRecord>;
  deleteMedia(mediaId: string): Promise<void>;
  getSignedUrl(mediaId: string): Promise<string>;
}
