'use client';

import React, { useState } from 'react';
import { Scene } from '@/lib/types/project';
import { ImagePrompt } from '@/lib/types/prompt';
import { useProjectStore } from '@/store/useProjectStore';
import { useGenerationStore } from '@/store/useGenerationStore';
import { useAssetStore } from '@/store/useAssetStore';
import PromptModeToggle from '../prompt/PromptModeToggle';
import PromptFormBuilder from '../prompt/PromptFormBuilder';
import PromptJsonEditor from '../prompt/PromptJsonEditor';
import GenerationJobCard from './GenerationJobCard';
import { Sparkles, Check, Eye, Film, Loader2 } from 'lucide-react';

interface ImageGenPanelProps {
  scene: Scene;
}

export default function ImageGenPanel({ scene }: ImageGenPanelProps) {
  const [mode, setMode] = useState<'form' | 'json'>('form');
  const { updateSceneImagePrompt, selectSceneImage } = useProjectStore();
  const { triggerImageGeneration, activeJobs, cancelJob, isGeneratingImage } = useGenerationStore();
  const { setPreviewAsset } = useAssetStore();

  const handlePromptChange = (updatedPrompt: ImagePrompt) => {
    updateSceneImagePrompt(scene.projectId, scene.id, updatedPrompt);
  };

  const handleGenerate = async () => {
    if (!scene.imagePrompt.prompt.trim() || isGeneratingImage) return;
    await triggerImageGeneration(scene.imagePrompt, scene.projectId, scene.id);
  };

  const imageAssets = scene.generatedAssets.filter((a) => a.type === 'image');
  const sceneActiveJobs = activeJobs.filter(
    (j) => j.sceneId === scene.id && j.type === 'image'
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Left Column: Prompt Configuration & Controls (5 Cols) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="glass-panel p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
              Keyframe Prompt
            </h3>
            <PromptModeToggle mode={mode} onModeChange={setMode} />
          </div>

          {mode === 'form' ? (
            <PromptFormBuilder
              prompt={scene.imagePrompt}
              onChange={handlePromptChange}
            />
          ) : (
            <PromptJsonEditor
              prompt={scene.imagePrompt}
              onChange={handlePromptChange}
            />
          )}

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGeneratingImage || !scene.imagePrompt.prompt.trim()}
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
              isGeneratingImage
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30 cursor-not-allowed'
                : 'bg-white text-black hover:bg-zinc-200 active:scale-[0.99]'
            }`}
          >
            {isGeneratingImage ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                Synthesizing Keyframe Latents...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Generate Keyframe Image ({scene.imagePrompt.num_outputs} outputs)
              </>
            )}
          </button>
        </div>

        {/* Active Generation Jobs for this Scene */}
        {sceneActiveJobs.length > 0 && (
          <div className="space-y-2">
            {sceneActiveJobs.map((job) => (
              <GenerationJobCard key={job.id} job={job} onCancel={cancelJob} />
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Generated Candidate Results (7 Cols) */}
      <div className="lg:col-span-7 space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
              Image Candidates
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-zinc-400">
              {imageAssets.length} Generated
            </span>
          </div>

          <span className="text-[11px] text-zinc-500">
            Click checkmark to set as keyframe for video
          </span>
        </div>

        {/* Grid of Images */}
        <div className="grid grid-cols-2 gap-3">
          {/* Skeleton Loaders if Generating */}
          {isGeneratingImage &&
            Array.from({ length: scene.imagePrompt.num_outputs || 2 }).map((_, idx) => (
              <div
                key={`skel_${idx}`}
                className="aspect-video rounded-xl skeleton-shimmer border border-white/10 flex flex-col items-center justify-center p-4 text-center"
              >
                <Loader2 className="w-5 h-5 text-zinc-500 animate-spin mb-2" />
                <span className="text-[11px] font-mono text-zinc-400">
                  Denoising output #{idx + 1}...
                </span>
              </div>
            ))}

          {/* Real Generated Assets */}
          {imageAssets.map((asset) => {
            const isSelected = scene.selectedImageId === asset.id;

            return (
              <div
                key={asset.id}
                className={`group relative aspect-video rounded-xl overflow-hidden glass-panel border transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <img
                  src={asset.url}
                  alt={asset.promptText}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />

                {/* Selected Keyframe Badge */}
                {isSelected && (
                  <div className="absolute top-2 left-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-medium shadow-md">
                    <Check className="w-3 h-3" />
                    Keyframe Selected
                  </div>
                )}

                {/* Seed Pill */}
                {asset.seed && (
                  <div className="absolute bottom-2 left-2 z-20 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] font-mono text-zinc-400">
                    Seed: {asset.seed}
                  </div>
                )}

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 z-30 p-4">
                  <button
                    type="button"
                    onClick={() => selectSceneImage(scene.projectId, scene.id, asset.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-black hover:bg-zinc-200'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {isSelected ? 'Selected' : 'Select Keyframe'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewAsset(asset)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/10"
                    title="Inspect & Fullscreen"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Empty state when no images generated yet */}
          {imageAssets.length === 0 && !isGeneratingImage && (
            <div className="col-span-2 py-16 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-6 bg-black/20">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 mb-3">
                <Film className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-medium text-white mb-1">
                No keyframe images generated yet
              </h4>
              <p className="text-xs text-zinc-400 max-w-sm">
                Configure your prompt parameters on the left and click &quot;Generate Keyframe Image&quot; to synthesize visual concepts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
