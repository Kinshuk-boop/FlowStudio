'use client';

import React, { useState } from 'react';
import { Scene } from '@/lib/types/project';
import { VideoPrompt, CameraMotion } from '@/lib/types/prompt';
import { cameraMotions } from '@/lib/schema/videoPrompt.schema';
import { useProjectStore } from '@/store/useProjectStore';
import { useGenerationStore } from '@/store/useGenerationStore';
import { useAssetStore } from '@/store/useAssetStore';
import GenerationJobCard from './GenerationJobCard';
import { 
  Film, 
  Video, 
  Sparkles, 
  Play, 
  Check, 
  Eye, 
  RotateCcw, 
  Loader2, 
  Sliders, 
  Code,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface VideoGenPanelProps {
  scene: Scene;
}

export default function VideoGenPanel({ scene }: VideoGenPanelProps) {
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const { updateSceneVideoPrompt, selectSceneVideo } = useProjectStore();
  const { triggerVideoGeneration, activeJobs, cancelJob, isGeneratingVideo } = useGenerationStore();
  const { setPreviewAsset } = useAssetStore();

  const selectedImage = scene.generatedAssets.find(
    (a) => a.id === scene.selectedImageId
  ) || scene.generatedAssets.find((a) => a.type === 'image');

  const videoAssets = scene.generatedAssets.filter((a) => a.type === 'video');
  const activeVideoJobs = activeJobs.filter(
    (j) => j.sceneId === scene.id && j.type === 'video'
  );

  const handleUpdate = (patch: Partial<VideoPrompt>) => {
    updateSceneVideoPrompt(scene.projectId, scene.id, {
      ...scene.videoPrompt,
      ...patch,
      source_image_id: selectedImage?.id || scene.videoPrompt.source_image_id,
      source_image_url: selectedImage?.url || scene.videoPrompt.source_image_url,
    });
  };

  const handleGenerate = async () => {
    if (!selectedImage || isGeneratingVideo) return;
    const promptToSubmit: VideoPrompt = {
      ...scene.videoPrompt,
      source_image_id: selectedImage.id,
      source_image_url: selectedImage.url,
    };
    await triggerVideoGeneration(promptToSubmit, scene.projectId, scene.id);
  };

  return (
    <div className="space-y-4">
      {/* Source Keyframe Banner */}
      <div className="glass-panel p-4 rounded-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-20 h-12 rounded-lg overflow-hidden border border-white/15 bg-black flex-shrink-0">
            {selectedImage ? (
              <img
                src={selectedImage.url}
                alt="Selected keyframe"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600">
                <Film className="w-4 h-4" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-1 left-1 text-[9px] font-mono text-zinc-300">
              16:9
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-semibold text-white">
                {selectedImage ? 'Keyframe Initialized' : 'No Keyframe Selected'}
              </h4>
              {selectedImage && (
                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                  <Check className="w-2.5 h-2.5" /> Source Ready
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 max-w-md truncate">
              {selectedImage
                ? selectedImage.promptText
                : 'Select an image from the candidates above to configure motion synthesis.'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-zinc-500 block">
            Resolution: 1920x1080
          </span>
          <span className="text-[11px] font-mono text-zinc-500 block">
            FPS: {scene.videoPrompt.fps || 24}
          </span>
        </div>
      </div>

      {/* Main Split: Form & Video Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Motion Prompt Parameters (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-4 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white tracking-wide uppercase font-mono flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-blue-400" />
                Motion Parameters
              </h3>
              <button
                type="button"
                onClick={() => setShowJsonPreview(!showJsonPreview)}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/8"
              >
                <Code className="w-3 h-3" />
                {showJsonPreview ? 'Hide JSON' : 'View JSON'}
              </button>
            </div>

            {/* Motion Prompt Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Motion Description
              </label>
              <textarea
                rows={3}
                value={scene.videoPrompt.motion_prompt}
                onChange={(e) => handleUpdate({ motion_prompt: e.target.value })}
                placeholder="Describe the physical movement, camera path, and physics in this shot..."
                className="w-full px-3 py-2 text-xs rounded-lg glass-input leading-relaxed resize-none"
              />
            </div>

            {/* Camera Motion Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Camera Motion Path
              </label>
              <select
                value={scene.videoPrompt.camera_motion}
                onChange={(e) =>
                  handleUpdate({ camera_motion: e.target.value as CameraMotion })
                }
                className="w-full px-3 py-2 text-xs rounded-lg glass-input bg-[#121319]"
              >
                {cameraMotions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration & FPS Controls */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Duration (Seconds)
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {[3, 5, 8, 10].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => handleUpdate({ duration_seconds: dur })}
                      className={`py-1 rounded text-center text-xs font-mono transition-all border ${
                        scene.videoPrompt.duration_seconds === dur
                          ? 'bg-white/10 text-white font-medium border-white/20'
                          : 'bg-white/3 text-zinc-400 border-white/5 hover:text-zinc-200'
                      }`}
                    >
                      {dur}s
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Frame Rate</label>
                <div className="grid grid-cols-3 gap-1">
                  {[24, 30, 60].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => handleUpdate({ fps: rate })}
                      className={`py-1 rounded text-center text-xs font-mono transition-all border ${
                        scene.videoPrompt.fps === rate
                          ? 'bg-white/10 text-white font-medium border-white/20'
                          : 'bg-white/3 text-zinc-400 border-white/5 hover:text-zinc-200'
                      }`}
                    >
                      {rate}fps
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Loop Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/5">
              <div className="text-xs">
                <span className="text-zinc-300 font-medium block">Seamless Loop</span>
                <span className="text-[10px] text-zinc-500">
                  Blend end frame back to start
                </span>
              </div>
              <input
                type="checkbox"
                checked={scene.videoPrompt.loop || false}
                onChange={(e) => handleUpdate({ loop: e.target.checked })}
                className="rounded bg-black border-white/20 text-blue-500 focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Collapsible JSON Preview */}
            {showJsonPreview && (
              <div className="p-3 rounded-lg bg-black/40 border border-white/10 font-mono text-[11px] text-zinc-300 space-y-1 overflow-x-auto">
                <pre>{JSON.stringify(scene.videoPrompt, null, 2)}</pre>
              </div>
            )}

            {/* Generate Video Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGeneratingVideo || !selectedImage}
              className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                isGeneratingVideo || !selectedImage
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-zinc-200 active:scale-[0.99]'
              }`}
            >
              {isGeneratingVideo ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                  Synthesizing Video Motion Vectors...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Video Clip ({scene.videoPrompt.duration_seconds || 5}s)
                </>
              )}
            </button>
          </div>

          {/* Active Generation Jobs for Video */}
          {activeVideoJobs.length > 0 && (
            <div className="space-y-2">
              {activeVideoJobs.map((job) => (
                <GenerationJobCard key={job.id} job={job} onCancel={cancelJob} />
              ))}
            </div>
          )}
        </div>

        {/* Right: Video Clip Results & Live Video Player (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
              Generated Video Takes
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-zinc-400">
              {videoAssets.length} Takes
            </span>
          </div>

          {/* Skeletons when generating video */}
          {isGeneratingVideo && (
            <div className="aspect-video rounded-xl skeleton-shimmer border border-white/10 flex flex-col items-center justify-center p-6 text-center">
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin mb-2.5" />
              <h4 className="text-xs font-medium text-white mb-1">
                Synthesizing temporal frame coherence...
              </h4>
              <span className="text-[11px] font-mono text-zinc-400">
                Interpolating motion matrices & depth fields
              </span>
            </div>
          )}

          {/* Video List & Interactive Player */}
          {videoAssets.map((asset) => {
            const isSelected = scene.selectedVideoId === asset.id;

            return (
              <div
                key={asset.id}
                className={`glass-panel rounded-xl overflow-hidden border p-3 space-y-3 transition-all ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-white/10'
                }`}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black group">
                  <video
                    src={asset.url}
                    controls
                    loop
                    className="w-full h-full object-cover"
                    poster={asset.thumbnailUrl}
                  />

                  {isSelected && (
                    <div className="absolute top-2 left-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-medium shadow-md">
                      <Check className="w-3 h-3" />
                      Active Scene Clip
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-white">
                      Take ({asset.durationSeconds || 5}s · 24fps)
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate max-w-sm">
                      {asset.promptText}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => selectSceneVideo(scene.projectId, scene.id, asset.id)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-zinc-200 hover:bg-white/20'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      {isSelected ? 'Active' : 'Set as Clip'}
                    </button>

                    <Link
                      href={`/project/${scene.projectId}/timeline`}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white"
                    >
                      Timeline
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty state when no video generated yet */}
          {videoAssets.length === 0 && !isGeneratingVideo && (
            <div className="py-16 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-6 bg-black/20">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 mb-3">
                <Video className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-medium text-white mb-1">
                No video synthesized for this scene yet
              </h4>
              <p className="text-xs text-zinc-400 max-w-sm">
                Ensure a keyframe is selected above, specify your motion description, and click &quot;Generate Video Clip&quot; to animate this shot.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
