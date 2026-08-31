import { z } from 'zod';
import { aspectRatios } from './imagePrompt.schema';

export const cameraMotions = [
  'static',
  'slow dolly in',
  'slow dolly out',
  'pan left',
  'pan right',
  'tilt up',
  'tilt down',
  'orbit clockwise',
  'pedestal crane up',
  'handheld organic shake',
  'drone forward tracking',
] as const;

export const VideoPromptSchema = z.object({
  type: z.literal('video'),
  source_image_id: z.string().min(1, 'Source image ID is required'),
  source_image_url: z.string().optional(),
  motion_prompt: z.string().min(1, 'Motion prompt is required'),
  camera_motion: z.enum(cameraMotions).default('slow dolly in'),
  duration_seconds: z.number().min(2).max(10).default(5),
  fps: z.number().default(24),
  aspect_ratio: z.enum(aspectRatios).default('16:9'),
  loop: z.boolean().default(false),
  seed: z.number().int().optional(),
});

export type VideoPromptSchemaType = z.infer<typeof VideoPromptSchema>;
