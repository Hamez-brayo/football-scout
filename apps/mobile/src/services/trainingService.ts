import apiClient from '@/src/api/client';
import type {
  ApiResponseEnvelope,
  CreateDrillSubmissionRequest,
  DrillSubmission,
  TrainingProgram,
} from '@vysion/shared';

export const trainingService = {
  async getPrograms(): Promise<TrainingProgram[]> {
    const response = await apiClient.get<ApiResponseEnvelope<TrainingProgram[]>>('/training/programs');
    return response.data.data ?? [];
  },

  async submitDrill(payload: CreateDrillSubmissionRequest): Promise<DrillSubmission> {
    const response = await apiClient.post<ApiResponseEnvelope<DrillSubmission>>('/training/submissions', payload);

    if (!response.data.data) {
      throw new Error('Invalid drill submission response payload');
    }

    return response.data.data;
  },
};
