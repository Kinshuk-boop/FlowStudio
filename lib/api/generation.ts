import { ImagePrompt, VideoPrompt } from '@/lib/types/prompt';
import { Asset } from '@/lib/types/asset';
import { GenerationJob } from '@/lib/types/job';
import { getMockImagesForPrompt, getRandomSampleVideo } from '@/mocks/mockGenerationApi';

// In-memory active jobs registry (for mock status polling)
const jobsMap = new Map<string, GenerationJob>();

export async function generateImage(
  prompt: ImagePrompt,
  projectId: string,
  sceneId: string
): Promise<GenerationJob> {
  const jobId = `job_img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const seed = prompt.seed || Math.floor(Math.random() * 900000) + 100000;

  const job: GenerationJob = {
    id: jobId,
    projectId,
    sceneId,
    type: 'image',
    status: 'queued',
    progress: 0,
    stageDescription: 'Queued in cluster...',
    createdAt: Date.now(),
    promptPayload: { ...prompt, seed },
  };

  jobsMap.set(jobId, job);
  return job;
}

export async function generateVideo(
  prompt: VideoPrompt,
  projectId: string,
  sceneId: string
): Promise<GenerationJob> {
  const jobId = `job_vid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const seed = prompt.seed || Math.floor(Math.random() * 900000) + 100000;

  const job: GenerationJob = {
    id: jobId,
    projectId,
    sceneId,
    type: 'video',
    status: 'queued',
    progress: 0,
    stageDescription: 'Allocating video render pipeline...',
    createdAt: Date.now(),
    promptPayload: { ...prompt, seed },
  };

  jobsMap.set(jobId, job);
  return job;
}

export function getJobStatus(jobId: string): GenerationJob | null {
  const job = jobsMap.get(jobId);
  if (!job) return null;

  if (job.status === 'done' || job.status === 'failed') {
    return job;
  }

  const elapsedMs = Date.now() - job.createdAt;
  const isVideo = job.type === 'video';
  const totalDurationMs = isVideo ? 3200 : 2200; // Simulated realistic generation duration

  if (elapsedMs < 400) {
    job.status = 'queued';
    job.progress = Math.min(10, Math.floor((elapsedMs / totalDurationMs) * 100));
    job.stageDescription = 'Allocating GPU workers...';
  } else if (elapsedMs < totalDurationMs) {
    job.status = 'running';
    job.progress = Math.min(95, Math.floor((elapsedMs / totalDurationMs) * 100));

    if (isVideo) {
      if (job.progress < 40) job.stageDescription = 'Extracting motion vectors & depth map...';
      else if (job.progress < 75) job.stageDescription = `Synthesizing frame sequence (${Math.floor(job.progress * 0.24)}/24 fps)...`;
      else job.stageDescription = 'Temporal coherence smoothing & upsampling...';
    } else {
      if (job.progress < 40) job.stageDescription = 'Text conditioning & CLIP latents...';
      else if (job.progress < 75) job.stageDescription = 'Diffusion denoising iterations...';
      else job.stageDescription = 'High-fidelity color grade & HDR pass...';
    }
  } else {
    // Finished!
    job.status = 'done';
    job.progress = 100;
    job.stageDescription = 'Generation complete';
    job.completedAt = Date.now();

    if (job.type === 'image') {
      const imgPrompt = job.promptPayload as ImagePrompt;
      const count = imgPrompt.num_outputs || 4;
      const urls = getMockImagesForPrompt(imgPrompt.prompt, count);

      const generatedAssets: Asset[] = urls.map((url, idx) => ({
        id: `asset_img_${Date.now()}_${idx}`,
        projectId: job.projectId,
        sceneId: job.sceneId,
        promptId: job.id,
        type: 'image',
        url,
        thumbnailUrl: url,
        seed: (imgPrompt.seed || 10000) + idx * 7,
        status: 'done',
        aspectRatio: imgPrompt.aspect_ratio || '16:9',
        promptText: imgPrompt.prompt,
        imagePrompt: imgPrompt,
        createdAt: new Date().toISOString(),
        width: 1920,
        height: 1080,
      }));

      job.resultAssets = generatedAssets;
    } else {
      const vidPrompt = job.promptPayload as VideoPrompt;
      const videoUrl = getRandomSampleVideo(Math.floor(Math.random() * 4));

      const generatedAsset: Asset = {
        id: `asset_vid_${Date.now()}`,
        projectId: job.projectId,
        sceneId: job.sceneId,
        promptId: job.id,
        type: 'video',
        url: videoUrl,
        thumbnailUrl: vidPrompt.source_image_url || getMockImagesForPrompt(vidPrompt.motion_prompt, 1)[0],
        seed: vidPrompt.seed || 424242,
        status: 'done',
        aspectRatio: vidPrompt.aspect_ratio || '16:9',
        durationSeconds: vidPrompt.duration_seconds || 5,
        promptText: vidPrompt.motion_prompt,
        videoPrompt: vidPrompt,
        createdAt: new Date().toISOString(),
        width: 1920,
        height: 1080,
      };

      job.resultAssets = [generatedAsset];
    }
  }

  return { ...job };
}
