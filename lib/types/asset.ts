import { ImagePrompt, VideoPrompt, AspectRatio } from './prompt';

export type AssetType = 'image' | 'video';
export type AssetStatus = 'queued' | 'running' | 'done' | 'failed';

export interface Asset {
  id: string;
  projectId: string;
  sceneId: string;
  promptId?: string;
  type: AssetType;
  url: string;
  thumbnailUrl: string;
  seed?: number;
  status: AssetStatus;
  aspectRatio: AspectRatio;
  durationSeconds?: number;
  promptText: string;
  imagePrompt?: ImagePrompt;
  videoPrompt?: VideoPrompt;
  createdAt: string;
  width?: number;
  height?: number;
}
