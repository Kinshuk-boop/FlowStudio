export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '21:9';

export type CameraAngle = 'eye level' | 'low angle' | 'high angle' | 'bird’s eye' | 'dutch angle' | 'worm’s eye';
export type CameraLens = '18mm ultra-wide' | '24mm wide' | '35mm standard' | '50mm prime' | '85mm portrait' | '135mm telephoto' | 'anamorphic 2.39:1';
export type CameraShot = 'extreme wide shot' | 'wide shot' | 'medium shot' | 'close up' | 'extreme close up' | 'over-the-shoulder';

export type CameraMotion = 
  | 'static'
  | 'slow dolly in'
  | 'slow dolly out'
  | 'pan left'
  | 'pan right'
  | 'tilt up'
  | 'tilt down'
  | 'orbit clockwise'
  | 'pedestal crane up'
  | 'handheld organic shake'
  | 'drone forward tracking';

export interface ImagePrompt {
  type: 'image';
  prompt: string;
  negative_prompt?: string;
  style?: string;
  aspect_ratio: AspectRatio;
  camera?: {
    angle?: CameraAngle;
    lens?: CameraLens;
    shot?: CameraShot;
  };
  lighting?: string;
  seed?: number;
  num_outputs: number;
}

export interface VideoPrompt {
  type: 'video';
  source_image_id: string;
  source_image_url?: string;
  motion_prompt: string;
  camera_motion: CameraMotion;
  duration_seconds: number; // e.g. 3, 5, 8, 10
  fps: number; // 24, 30, 60
  aspect_ratio: AspectRatio;
  loop: boolean;
  seed?: number;
}
