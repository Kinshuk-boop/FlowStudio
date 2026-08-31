'use client';

import React, { useState } from 'react';
import { useAssetStore } from '@/store/useAssetStore';
import { useProjectStore } from '@/store/useProjectStore';
import { 
  X, 
  Film, 
  Video, 
  Check, 
  Copy, 
  Download, 
  Sliders, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';

export default function AssetPreviewModal() {
  const { previewAsset, setPreviewAsset } = useAssetStore();
  const { selectSceneImage, selectSceneVideo } = useProjectStore();
  const [copied, setCopied] = useState(false);

  if (!previewAsset) return null;

  const isVideo = previewAsset.type === 'video';

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(previewAsset.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleUseInScene = () => {
    if (isVideo) {
      selectSceneVideo(previewAsset.projectId, previewAsset.sceneId, previewAsset.id);
    } else {
      selectSceneImage(previewAsset.projectId, previewAsset.sceneId, previewAsset.id);
    }
    setPreviewAsset(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      {/* Backdrop click dismiss */}
      <div className="absolute inset-0" onClick={() => setPreviewAsset(null)} />

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl rounded-2xl glass-panel-elevated border border-white/15 overflow-hidden shadow-2xl flex flex-col md:flex-row z-10 max-h-[90vh]">
        {/* Media Preview Column (Left 65%) */}
        <div className="flex-1 bg-black/90 flex flex-col items-center justify-center p-4 relative min-h-[350px]">
          {isVideo ? (
            <video
              src={previewAsset.url}
              controls
              autoPlay
              loop
              className="max-w-full max-h-[70vh] rounded-lg object-contain"
            />
          ) : (
            <img
              src={previewAsset.url}
              alt={previewAsset.promptText}
              className="max-w-full max-h-[70vh] rounded-lg object-contain"
            />
          )}

          <button
            type="button"
            onClick={() => setPreviewAsset(null)}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/60 hover:bg-black text-zinc-300 hover:text-white transition-colors border border-white/10 md:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Metadata Column (Right 35%) */}
        <div className="w-full md:w-96 p-5 bg-[#12131a] border-t md:border-t-0 md:border-l border-white/10 flex flex-col justify-between overflow-y-auto space-y-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-white/5 border border-white/10 text-zinc-300">
                  {isVideo ? <Video className="w-4 h-4" /> : <Film className="w-4 h-4" />}
                </span>
                <span className="text-xs font-mono uppercase text-zinc-400">
                  {previewAsset.type} Asset
                </span>
              </div>

              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="hidden md:block p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Prompt Text */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-zinc-300">
                <span>Prompt</span>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/8 text-xs text-zinc-300 leading-relaxed max-h-36 overflow-y-auto font-mono">
                {previewAsset.promptText}
              </div>
            </div>

            {/* Parameter Metadata Table */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-400">Resolution</span>
                <span className="font-mono text-zinc-200">
                  {previewAsset.width || 1920} × {previewAsset.height || 1080}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-400">Aspect Ratio</span>
                <span className="font-mono text-zinc-200">{previewAsset.aspectRatio}</span>
              </div>

              {previewAsset.seed && (
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-zinc-400">Seed</span>
                  <span className="font-mono text-zinc-200">{previewAsset.seed}</span>
                </div>
              )}

              {isVideo && previewAsset.durationSeconds && (
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-zinc-400">Duration</span>
                  <span className="font-mono text-zinc-200">
                    {previewAsset.durationSeconds}s @ 24fps
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-400">Generated On</span>
                <span className="font-mono text-zinc-200">
                  {new Date(previewAsset.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleUseInScene}
              className="w-full py-2.5 px-4 rounded-lg bg-white text-black hover:bg-zinc-200 font-medium text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
            >
              <Check className="w-3.5 h-3.5" />
              Set as Active in Scene
            </button>

            <a
              href={previewAsset.url}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Original Raw URL
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
