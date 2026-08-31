'use client';

import React from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { useAssetStore } from '@/store/useAssetStore';
import AssetCard from './AssetCard';
import { Asset } from '@/lib/types/asset';
import { Search, Film, Video, Filter, Sparkles } from 'lucide-react';

export default function AssetGrid() {
  const { getActiveProject } = useProjectStore();
  const { 
    filterType, 
    setFilterType, 
    filterSceneId, 
    setFilterSceneId, 
    searchQuery, 
    setSearchQuery 
  } = useAssetStore();

  const currentProject = getActiveProject();
  if (!currentProject) return null;

  // Aggregate all generated assets across all scenes in project
  const allAssets: Asset[] = currentProject.scenes.flatMap((s) => s.generatedAssets);

  // Filter assets
  const filteredAssets = allAssets.filter((asset) => {
    // Type filter
    if (filterType !== 'all' && asset.type !== filterType) return false;

    // Scene filter
    if (filterSceneId !== 'all' && asset.sceneId !== filterSceneId) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPrompt = asset.promptText.toLowerCase().includes(q);
      const matchType = asset.type.toLowerCase().includes(q);
      return matchPrompt || matchType;
    }

    return true;
  });

  const imageCount = allAssets.filter((a) => a.type === 'image').length;
  const videoCount = allAssets.filter((a) => a.type === 'video').length;

  return (
    <div className="space-y-5">
      {/* Controls Bar: Type Tabs & Search */}
      <div className="glass-panel p-3 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Type Tabs */}
        <div className="flex items-center p-0.5 rounded-lg bg-black/40 border border-white/8 text-xs w-full md:w-auto">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-md font-medium transition-all ${
              filterType === 'all'
                ? 'bg-white/10 text-white shadow-sm border border-white/10'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Assets ({allAssets.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterType('image')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              filterType === 'image'
                ? 'bg-white/10 text-white shadow-sm border border-white/10'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Film className="w-3 h-3" />
            Images ({imageCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterType('video')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              filterType === 'video'
                ? 'bg-white/10 text-white shadow-sm border border-white/10'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Video className="w-3 h-3 text-blue-400" />
            Videos ({videoCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts, seeds, styles..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg glass-input"
          />
        </div>
      </div>

      {/* Scene Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <span className="text-[11px] font-mono text-zinc-500 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" />
          Scene:
        </span>

        <button
          type="button"
          onClick={() => setFilterSceneId('all')}
          className={`px-2.5 py-1 rounded-md text-xs transition-all border whitespace-nowrap ${
            filterSceneId === 'all'
              ? 'bg-white/10 text-white border-white/20 font-medium'
              : 'bg-white/3 text-zinc-400 border-white/5 hover:text-zinc-200'
          }`}
        >
          All Scenes ({currentProject.scenes.length})
        </button>

        {currentProject.scenes.map((scene) => (
          <button
            key={scene.id}
            type="button"
            onClick={() => setFilterSceneId(scene.id)}
            className={`px-2.5 py-1 rounded-md text-xs transition-all border whitespace-nowrap ${
              filterSceneId === scene.id
                ? 'bg-white/10 text-white border-white/20 font-medium'
                : 'bg-white/3 text-zinc-400 border-white/5 hover:text-zinc-200'
            }`}
          >
            {scene.name} ({scene.generatedAssets.length})
          </button>
        ))}
      </div>

      {/* Assets Grid */}
      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        <div className="py-20 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-6 bg-black/20">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-medium text-white mb-1">
            No matching assets found
          </h4>
          <p className="text-xs text-zinc-400 max-w-sm">
            Try adjusting your search query or scene filters, or generate new media from the Workspace.
          </p>
        </div>
      )}
    </div>
  );
}
