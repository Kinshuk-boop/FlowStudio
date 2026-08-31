import { ImagePrompt, VideoPrompt } from '@/lib/types/prompt';
import { Asset } from '@/lib/types/asset';
import { GenerationJob } from '@/lib/types/job';

// Curated cinematic high-resolution visual placeholders
const CINEMATIC_PRESETS: Record<string, string[]> = {
  desert: [
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1600&q=80',
  ],
  cyber: [
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
  ],
  space: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
  ],
  mountain: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80',
  ],
};

// High quality sample MP4 video clips
const SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
];

export function getMockImagesForPrompt(promptText: string, count: number = 4): string[] {
  const lower = promptText.toLowerCase();
  let pool = CINEMATIC_PRESETS.default;

  if (lower.includes('desert') || lower.includes('sand') || lower.includes('dune') || lower.includes('mars') || lower.includes('cave')) {
    pool = CINEMATIC_PRESETS.desert;
  } else if (lower.includes('city') || lower.includes('cyber') || lower.includes('neon') || lower.includes('street')) {
    pool = CINEMATIC_PRESETS.cyber;
  } else if (lower.includes('space') || lower.includes('planet') || lower.includes('astronaut') || lower.includes('star') || lower.includes('galaxy')) {
    pool = CINEMATIC_PRESETS.space;
  } else if (lower.includes('mountain') || lower.includes('snow') || lower.includes('forest') || lower.includes('peak')) {
    pool = CINEMATIC_PRESETS.mountain;
  }

  const results: string[] = [];
  for (let i = 0; i < count; i++) {
    results.push(pool[i % pool.length]);
  }
  return results;
}

export function getRandomSampleVideo(index: number = 0): string {
  return SAMPLE_VIDEOS[index % SAMPLE_VIDEOS.length];
}
