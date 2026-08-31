import { ImagePrompt, VideoPrompt } from './prompt';
import { Asset } from './asset';

export interface Scene {
  id: string;
  projectId: string;
  order: number;
  name: string;
  description?: string;
  selectedImageId?: string;
  selectedVideoId?: string;
  imagePrompt: ImagePrompt;
  videoPrompt: VideoPrompt;
  generatedAssets: Asset[];
  durationSeconds: number;
  transitionToNext?: 'cut' | 'crossfade' | 'dissolve' | 'wipe';
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  aspectRatio: '16:9' | '9:16' | '1:1' | '2.39:1';
  fps: number;
  resolution: string; // e.g. "1920x1080" | "3840x2160"
  scenes: Scene[];
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
}
