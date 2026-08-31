import { create } from 'zustand';
import { GenerationJob } from '@/lib/types/job';
import { ImagePrompt, VideoPrompt } from '@/lib/types/prompt';
import { generateImage, generateVideo, getJobStatus } from '@/lib/api/generation';
import { useProjectStore } from './useProjectStore';

interface GenerationState {
  activeJobs: GenerationJob[];
  jobHistory: GenerationJob[];
  isGeneratingImage: boolean;
  isGeneratingVideo: boolean;

  // Actions
  triggerImageGeneration: (prompt: ImagePrompt, projectId: string, sceneId: string) => Promise<string>;
  triggerVideoGeneration: (prompt: VideoPrompt, projectId: string, sceneId: string) => Promise<string>;
  cancelJob: (jobId: string) => void;
  clearCompletedJobs: () => void;
}

export const useGenerationStore = create<GenerationState>((set, get) => ({
  activeJobs: [],
  jobHistory: [],
  isGeneratingImage: false,
  isGeneratingVideo: false,

  triggerImageGeneration: async (prompt: ImagePrompt, projectId: string, sceneId: string) => {
    const job = await generateImage(prompt, projectId, sceneId);

    set((state) => ({
      activeJobs: [job, ...state.activeJobs],
      isGeneratingImage: true,
    }));

    // Start live polling loop for status updates
    const pollInterval = setInterval(() => {
      const updatedJob = getJobStatus(job.id);
      if (!updatedJob) {
        clearInterval(pollInterval);
        return;
      }

      set((state) => ({
        activeJobs: state.activeJobs.map((j) => (j.id === job.id ? updatedJob : j)),
      }));

      if (updatedJob.status === 'done' || updatedJob.status === 'failed') {
        clearInterval(pollInterval);

        if (updatedJob.status === 'done' && updatedJob.resultAssets) {
          // Push result assets to project scene
          useProjectStore.getState().addGeneratedAssetsToScene(
            projectId,
            sceneId,
            updatedJob.resultAssets
          );
        }

        set((state) => {
          const remainingActive = state.activeJobs.filter((j) => j.id !== job.id);
          const hasImageJob = remainingActive.some((j) => j.type === 'image');
          const hasVideoJob = remainingActive.some((j) => j.type === 'video');

          return {
            activeJobs: remainingActive,
            jobHistory: [updatedJob, ...state.jobHistory],
            isGeneratingImage: hasImageJob,
            isGeneratingVideo: hasVideoJob,
          };
        });
      }
    }, 250);

    return job.id;
  },

  triggerVideoGeneration: async (prompt: VideoPrompt, projectId: string, sceneId: string) => {
    const job = await generateVideo(prompt, projectId, sceneId);

    set((state) => ({
      activeJobs: [job, ...state.activeJobs],
      isGeneratingVideo: true,
    }));

    // Start live polling loop for video status updates
    const pollInterval = setInterval(() => {
      const updatedJob = getJobStatus(job.id);
      if (!updatedJob) {
        clearInterval(pollInterval);
        return;
      }

      set((state) => ({
        activeJobs: state.activeJobs.map((j) => (j.id === job.id ? updatedJob : j)),
      }));

      if (updatedJob.status === 'done' || updatedJob.status === 'failed') {
        clearInterval(pollInterval);

        if (updatedJob.status === 'done' && updatedJob.resultAssets) {
          useProjectStore.getState().addGeneratedAssetsToScene(
            projectId,
            sceneId,
            updatedJob.resultAssets
          );
        }

        set((state) => {
          const remainingActive = state.activeJobs.filter((j) => j.id !== job.id);
          const hasImageJob = remainingActive.some((j) => j.type === 'image');
          const hasVideoJob = remainingActive.some((j) => j.type === 'video');

          return {
            activeJobs: remainingActive,
            jobHistory: [updatedJob, ...state.jobHistory],
            isGeneratingImage: hasImageJob,
            isGeneratingVideo: hasVideoJob,
          };
        });
      }
    }, 250);

    return job.id;
  },

  cancelJob: (jobId: string) => {
    set((state) => ({
      activeJobs: state.activeJobs.filter((j) => j.id !== jobId),
      isGeneratingImage: state.activeJobs.some((j) => j.id !== jobId && j.type === 'image'),
      isGeneratingVideo: state.activeJobs.some((j) => j.id !== jobId && j.type === 'video'),
    }));
  },

  clearCompletedJobs: () => {
    set({ jobHistory: [] });
  },
}));
