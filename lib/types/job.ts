import { Asset } from './asset';
import { ImagePrompt, VideoPrompt } from './prompt';

export type JobStatus = 'queued' | 'running' | 'done' | 'failed';

export interface GenerationJob {
  id: string;
  projectId: string;
  sceneId: string;
  type: 'image' | 'video';
  status: JobStatus;
  progress: number; // 0 to 100
  stageDescription?: string; // e.g. "Sampling latent space", "Denoising frames 12/24"
  error?: string;
  createdAt: number;
  completedAt?: number;
  promptPayload: ImagePrompt | VideoPrompt;
  resultAssets?: Asset[];
}
