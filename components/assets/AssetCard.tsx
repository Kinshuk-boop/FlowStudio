'use client';

import React from 'react';
import { Asset } from '@/lib/types/asset';
import { useAssetStore } from '@/store/useAssetStore';
import { useProjectStore } from '@/store/useProjectStore';
import { Film, Video, Eye, Check, Download, Sparkles } from 'lucide-react';

interface AssetCardProps {
  asset: Asset;
}

export default function AssetCard({ asset }: AssetCardProps) {
  const { setPreviewAsset, selectedAssetIds, toggleAssetSelection } = useAssetStore();
  const { selectSceneImage, selectSceneVideo } = useProjectStore();

  const isVideo = asset.type === 'video';
  const isSelected = selectedAssetIds.includes(asset.id);

  return (
    <div
      className={`group relative rounded-xl overflow-hidden glass-panel border transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/20'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* Thumbnail / Media Container */}
      <div className="relative aspect-video bg-black/60 overflow-hidden">
        <img
          src={asset.thumbnailUrl || asset.url}
          alt={asset.promptText}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />

        {/* Type Badge */}
        <span className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur text-[10px] font-mono text-zinc-300 flex items-center gap-1 border border-white/10">
          {isVideo ? (
            <>
              <Video className="w-3 h-3 text-blue-400" />
              VIDEO ({asset.durationSeconds || 5}s)
            </>
          ) : (
            <>
              <Film className="w-3 h-3 text-zinc-400" />
              IMAGE
            </>
          )}
        </span>

        {/* Seed */}
        {asset.seed && (
          <span className="absolute top-2 right-2 z-20 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur text-[9px] font-mono text-zinc-400">
            Seed: {asset.seed}
          </span>
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-30 p-3">
          <button
            type="button"
            onClick={() => {
              if (isVideo) {
                selectSceneVideo(asset.projectId, asset.sceneId, asset.id);
              } else {
                selectSceneImage(asset.projectId, asset.sceneId, asset.id);
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white text-black hover:bg-zinc-200 transition-all shadow-md"
            title="Set as active keyframe for this scene"
          >
            <Check className="w-3 h-3" />
            Use in Scene
          </button>

          <button
            type="button"
            onClick={() => setPreviewAsset(asset)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all"
            title="Inspect Prompt & Metadata"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-[#0d0e13]/90 space-y-1 border-t border-white/5">
        <p className="text-xs text-zinc-200 truncate font-medium">
          {asset.promptText}
        </p>
        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
          <span>{asset.aspectRatio} · {asset.width || 1920}x{asset.height || 1080}</span>
          <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
