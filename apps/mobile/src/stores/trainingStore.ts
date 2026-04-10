import { create } from 'zustand';
import type {
  CreateDrillSubmissionRequest,
  DrillSubmission,
  TrainingProgram,
} from '@vysion/shared';
import { trainingService } from '@/src/services/trainingService';

type TrainingStoreState = {
  programs: TrainingProgram[];
  submissions: DrillSubmission[];
  isLoading: boolean;
  error: string | null;
  fetchPrograms: () => Promise<void>;
  submitDrill: (payload: CreateDrillSubmissionRequest) => Promise<DrillSubmission | null>;
  clearTraining: () => void;
};

export const useTrainingStore = create<TrainingStoreState>((set, get) => ({
  programs: [],
  submissions: [],
  isLoading: false,
  error: null,

  fetchPrograms: async () => {
    set({ isLoading: true, error: null });

    try {
      const programs = await trainingService.getPrograms();
      set({ programs, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch training programs';
      set({ error: message, isLoading: false });
    }
  },

  submitDrill: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const submission = await trainingService.submitDrill(payload);
      set({
        submissions: [submission, ...get().submissions],
        isLoading: false,
      });
      return submission;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit drill';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  clearTraining: () => {
    set({ programs: [], submissions: [], isLoading: false, error: null });
  },
}));
