import { z } from 'zod';

export const cameraAngles = [
  'eye level',
  'low angle',
  'high angle',
  'bird’s eye',
  'dutch angle',
  'worm’s eye',
] as const;

export const cameraLenses = [
  '18mm ultra-wide',
  '24mm wide',
  '35mm standard',
  '50mm prime',
  '85mm portrait',
  '135mm telephoto',
  'anamorphic 2.39:1',
] as const;

export const cameraShots = [
  'extreme wide shot',
  'wide shot',
  'medium shot',
  'close up',
  'extreme close up',
  'over-the-shoulder',
] as const;

export const aspectRatios = ['16:9', '9:16', '1:1', '4:3', '21:9'] as const;

export const ImagePromptSchema = z.object({
  type: z.literal('image'),
  prompt: z.string().min(1, 'Prompt text is required'),
  negative_prompt: z.string().optional(),
  style: z.string().optional(),
  aspect_ratio: z.enum(aspectRatios).default('16:9'),
  camera: z
    .object({
      angle: z.enum(cameraAngles).optional(),
      lens: z.enum(cameraLenses).optional(),
      shot: z.enum(cameraShots).optional(),
    })
    .optional(),
  lighting: z.string().optional(),
  seed: z.number().int().optional(),
  num_outputs: z.number().int().min(1).max(4).default(4),
});

export type ImagePromptSchemaType = z.infer<typeof ImagePromptSchema>;
