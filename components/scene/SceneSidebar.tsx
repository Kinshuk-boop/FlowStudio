'use client';

import React, { useState } from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { Scene } from '@/lib/types/project';
import { 
  Plus, 
  Trash2, 
  Film, 
  Check, 
  Clock, 
  GripVertical, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function SceneSidebar() {
  const { 
    projects, 
    activeProjectId, 
    activeSceneId, 
    setActiveScene, 
    getActiveProject, 
    addScene, 
    deleteScene 
  } = useProjectStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentProject = getActiveProject();

  if (!currentProject) return null;

  const handleAddScene = () => {
    const newScene = addScene(currentProject.id);
    setActiveScene(newScene.id);
  };

  const totalRuntime = currentProject.scenes.reduce(
    (acc, s) => acc + (s.durationSeconds || 5),
    0
  );

  return (
    <aside
      className={`relative border-r border-[var(--border)] bg-[#0e0f14]/85 backdrop-blur-2xl transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-14' : 'w-72'
      }`}
    >
      {/* Header */}
      <div className="p-3.5 border-b border-white/8 flex items-center justify-between">
        {!isCollapsed && (
          <div className="min-w-0">
            <h2 className="text-xs font-semibold text-white truncate">
              {currentProject.name}
            </h2>
            <span className="text-[11px] font-mono text-zinc-400">
              {currentProject.scenes.length} Scenes · {totalRuntime}s Total
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Add Scene Action */}
      {!isCollapsed ? (
        <div className="p-3 border-b border-white/5">
          <button
            type="button"
            onClick={handleAddScene}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-zinc-200 hover:text-white border border-white/10 transition-all active:scale-[0.99]"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Scene (Shot)
          </button>
        </div>
      ) : (
        <div className="p-2 border-b border-white/5 flex justify-center">
          <button
            type="button"
            onClick={handleAddScene}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-200 hover:text-white border border-white/10"
            title="Add New Scene"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Scrollable Scene List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {currentProject.scenes.map((scene, idx) => {
          const isActive = scene.id === activeSceneId;
          const hasImage = !!scene.selectedImageId || scene.generatedAssets.some((a) => a.type === 'image');
          const hasVideo = !!scene.selectedVideoId || scene.generatedAssets.some((a) => a.type === 'video');

          const activeThumbnail = scene.generatedAssets.find(
            (a) => a.id === scene.selectedImageId
          )?.url || scene.generatedAssets[0]?.url;

          if (isCollapsed) {
            return (
              <button
                key={scene.id}
                onClick={() => setActiveScene(scene.id)}
                className={`w-full aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all border ${
                  isActive
                    ? 'bg-white/15 border-blue-500 text-white shadow-sm'
                    : 'bg-black/20 border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
                title={scene.name}
              >
                <span className="text-xs font-mono font-medium">#{idx + 1}</span>
                {hasVideo ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute bottom-1.5" />
                ) : hasImage ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 absolute bottom-1.5" />
                ) : null}
              </button>
            );
          }

          return (
            <div
              key={scene.id}
              onClick={() => setActiveScene(scene.id)}
              className={`group relative flex items-center gap-2.5 p-2 rounded-xl cursor-pointer border transition-all ${
                isActive
                  ? 'bg-white/10 border-white/20 shadow-md text-white'
                  : 'bg-black/20 border-white/5 text-zinc-300 hover:bg-white/5 hover:border-white/10'
              }`}
            >
              {/* Drag Handle */}
              <div className="text-zinc-600 group-hover:text-zinc-400 flex-shrink-0 cursor-grab">
                <GripVertical className="w-3.5 h-3.5" />
              </div>

              {/* Thumbnail */}
              <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-black/60 border border-white/10 flex-shrink-0">
                {activeThumbnail ? (
                  <img
                    src={activeThumbnail}
                    alt={scene.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    <Film className="w-4 h-4" />
                  </div>
                )}

                <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-zinc-300 bg-black/70 px-1 rounded">
                  {scene.durationSeconds || 5}s
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium truncate block">
                    {scene.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono text-zinc-500">
                    Shot #{idx + 1}
                  </span>

                  {hasVideo ? (
                    <span className="flex items-center gap-0.5 text-[9px] text-emerald-400 bg-emerald-500/10 px-1 rounded">
                      <Check className="w-2.5 h-2.5" /> Video Ready
                    </span>
                  ) : hasImage ? (
                    <span className="text-[9px] text-blue-400 bg-blue-500/10 px-1 rounded">
                      Keyframe Set
                    </span>
                  ) : (
                    <span className="text-[9px] text-zinc-500">Empty</span>
                  )}
                </div>
              </div>

              {/* Delete Button on Hover */}
              {currentProject.scenes.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteScene(currentProject.id, scene.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-all"
                  title="Delete Scene"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
