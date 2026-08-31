'use client';

import React from 'react';
import { ImagePrompt, AspectRatio, CameraAngle, CameraLens, CameraShot } from '@/lib/types/prompt';
import { cameraAngles, cameraLenses, cameraShots, aspectRatios } from '@/lib/schema/imagePrompt.schema';
import { Dices, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface PromptFormBuilderProps {
  prompt: ImagePrompt;
  onChange: (prompt: ImagePrompt) => void;
}

const STYLE_PRESETS = [
  'Cinematic 35mm',
  'Photorealistic IMAX',
  'Anamorphic 2.39:1',
  'Dark Sci-Fi Cyberpunk',
  'Vintage 70mm Film',
  'Hyper-detailed Octane',
];

const LIGHTING_PRESETS = [
  'Golden hour with rim light',
  'Volumetric dust rays & deep shadows',
  'Bioluminescent cyan glow',
  'High contrast neon edge light',
  'Moody overcast diffuse lighting',
  'Dramatic single key spotlight',
];

export default function PromptFormBuilder({ prompt, onChange }: PromptFormBuilderProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleUpdate = (patch: Partial<ImagePrompt>) => {
    onChange({
      ...prompt,
      ...patch,
    });
  };

  const handleCameraUpdate = (
    key: 'angle' | 'lens' | 'shot',
    val: string
  ) => {
    handleUpdate({
      camera: {
        ...prompt.camera,
        [key]: val ? (val as any) : undefined,
      },
    });
  };

  const randomizeSeed = () => {
    const newSeed = Math.floor(Math.random() * 900000) + 100000;
    handleUpdate({ seed: newSeed });
  };

  return (
    <div className="space-y-4">
      {/* Prompt Subject / Action */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-300">
            Prompt / Subject Description
          </label>
          <span className="text-[11px] font-mono text-zinc-500">
            {prompt.prompt.length} chars
          </span>
        </div>
        <textarea
          rows={3}
          value={prompt.prompt}
          onChange={(e) => handleUpdate({ prompt: e.target.value })}
          placeholder="Describe your scene keyframe in cinematic detail (subject, action, environment)..."
          className="w-full px-3 py-2 text-xs rounded-lg glass-input leading-relaxed resize-none"
        />
      </div>

      {/* Style Chips */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-zinc-400" />
          Cinematic Style Presets
        </label>
        <div className="flex flex-wrap gap-1.5">
          {STYLE_PRESETS.map((style) => {
            const isSelected = prompt.style === style;
            return (
              <button
                key={style}
                type="button"
                onClick={() => handleUpdate({ style: isSelected ? '' : style })}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all border ${
                  isSelected
                    ? 'bg-blue-500/15 border-blue-500/40 text-blue-300 font-medium'
                    : 'bg-white/4 border-white/8 text-zinc-400 hover:text-zinc-200 hover:bg-white/8'
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      </div>

      {/* Aspect Ratio & Outputs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300">Aspect Ratio</label>
          <div className="grid grid-cols-3 gap-1">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => handleUpdate({ aspect_ratio: ratio as AspectRatio })}
                className={`py-1 rounded text-center text-xs font-mono transition-all border ${
                  prompt.aspect_ratio === ratio
                    ? 'bg-white/10 text-white font-medium border-white/20'
                    : 'bg-white/3 text-zinc-400 border-white/5 hover:text-zinc-200 hover:bg-white/6'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        {/* Batch Outputs Count */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-300">Batch Outputs</label>
            <span className="text-xs font-mono text-zinc-400">
              {prompt.num_outputs} images
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleUpdate({ num_outputs: num })}
                className={`py-1 rounded text-center text-xs font-mono transition-all border ${
                  prompt.num_outputs === num
                    ? 'bg-white/10 text-white font-medium border-white/20'
                    : 'bg-white/3 text-zinc-400 border-white/5 hover:text-zinc-200 hover:bg-white/6'
                }`}
              >
                {num}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Camera Controls */}
      <div className="p-3 rounded-lg bg-black/25 border border-white/6 space-y-2.5">
        <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
          Camera & Composition
        </div>
        <div className="grid grid-cols-3 gap-2">
          {/* Shot Type */}
          <div className="space-y-1">
            <label className="text-[11px] text-zinc-400">Shot Type</label>
            <select
              value={prompt.camera?.shot || ''}
              onChange={(e) => handleCameraUpdate('shot', e.target.value)}
              className="w-full px-2 py-1.5 text-xs rounded-md glass-input bg-[#121319]"
            >
              <option value="">Auto Shot</option>
              {cameraShots.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Focal Lens */}
          <div className="space-y-1">
            <label className="text-[11px] text-zinc-400">Focal Lens</label>
            <select
              value={prompt.camera?.lens || ''}
              onChange={(e) => handleCameraUpdate('lens', e.target.value)}
              className="w-full px-2 py-1.5 text-xs rounded-md glass-input bg-[#121319]"
            >
              <option value="">Auto Lens</option>
              {cameraLenses.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Angle */}
          <div className="space-y-1">
            <label className="text-[11px] text-zinc-400">Camera Angle</label>
            <select
              value={prompt.camera?.angle || ''}
              onChange={(e) => handleCameraUpdate('angle', e.target.value)}
              className="w-full px-2 py-1.5 text-xs rounded-md glass-input bg-[#121319]"
            >
              <option value="">Auto Angle</option>
              {cameraAngles.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lighting Condition */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-300">
          Lighting & Atmospheric Condition
        </label>
        <div className="relative">
          <input
            type="text"
            value={prompt.lighting || ''}
            onChange={(e) => handleUpdate({ lighting: e.target.value })}
            placeholder="e.g. Golden hour rim lighting with deep atmospheric shadows..."
            className="w-full px-3 py-1.5 text-xs rounded-lg glass-input"
          />
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {LIGHTING_PRESETS.slice(0, 3).map((light) => (
            <button
              key={light}
              type="button"
              onClick={() => handleUpdate({ lighting: light })}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 bg-white/3 hover:bg-white/6 px-1.5 py-0.5 rounded border border-white/5 truncate max-w-[200px]"
            >
              + {light}
            </button>
          ))}
        </div>
      </div>

      {/* Seed & Advanced Toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          {showAdvanced ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
          {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced (Negative Prompt, Seed)'}
        </button>

        {showAdvanced && (
          <div className="mt-3 p-3 rounded-lg bg-black/25 border border-white/6 space-y-3">
            {/* Negative Prompt */}
            <div className="space-y-1">
              <label className="text-xs text-zinc-300">Negative Prompt</label>
              <input
                type="text"
                value={prompt.negative_prompt || ''}
                onChange={(e) => handleUpdate({ negative_prompt: e.target.value })}
                placeholder="blurry, low quality, artifacts, watermark..."
                className="w-full px-2.5 py-1.5 text-xs rounded-md glass-input"
              />
            </div>

            {/* Seed Control */}
            <div className="flex items-center gap-2">
              <div className="flex-1 space-y-1">
                <label className="text-xs text-zinc-300">Seed</label>
                <input
                  type="number"
                  value={prompt.seed ?? ''}
                  onChange={(e) =>
                    handleUpdate({
                      seed: e.target.value ? parseInt(e.target.value, 10) : undefined,
                    })
                  }
                  placeholder="Random (e.g. 81921)"
                  className="w-full px-2.5 py-1.5 text-xs font-mono rounded-md glass-input"
                />
              </div>

              <button
                type="button"
                onClick={randomizeSeed}
                className="mt-5 p-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white"
                title="Randomize Seed"
              >
                <Dices className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
