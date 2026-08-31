'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useProjectStore } from '@/store/useProjectStore';
import TopNav from '@/components/navigation/TopNav';
import SceneSidebar from '@/components/scene/SceneSidebar';
import ImageGenPanel from '@/components/generation/ImageGenPanel';
import VideoGenPanel from '@/components/generation/VideoGenPanel';
import { Film, Video, Sparkles, Layers, Sliders } from 'lucide-react';

export default function ProjectWorkspacePage() {
  const params = useParams();
  const projectId = params?.id as string;
  const { getActiveProject, getActiveScene, setActiveProject } = useProjectStore();

  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'image' | 'video'>('image');

  React.useEffect(() => {
    if (projectId) {
      setActiveProject(projectId);
    }
  }, [projectId, setActiveProject]);

  const currentProject = getActiveProject();
  const activeScene = getActiveScene();

  if (!currentProject || !activeScene) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400 text-xs">
        Loading Project Workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Collapsible Scene List Sidebar */}
        <SceneSidebar />

        {/* Right: Main Workspace & Generation Studio */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7 space-y-6">
          {/* Scene Header & Mode Pill Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-zinc-500">
                  SHOT #{activeScene.order + 1}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-[11px] font-mono text-zinc-400">
                  {activeScene.durationSeconds || 5}s Duration
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                {activeScene.name}
              </h1>
            </div>

            {/* Workflow Mode Tabs: 1. Keyframe Image Gen -> 2. Video Motion Studio */}
            <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/8">
              <button
                type="button"
                onClick={() => setActiveWorkflowTab('image')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeWorkflowTab === 'image'
                    ? 'bg-white/12 text-white shadow-sm border border-white/12'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                1. Image Keyframe
              </button>

              <button
                type="button"
                onClick={() => setActiveWorkflowTab('video')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeWorkflowTab === 'video'
                    ? 'bg-white/12 text-white shadow-sm border border-white/12'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-blue-400" />
                2. Video Motion Studio
              </button>
            </div>
          </div>

          {/* Active Generation Tab View */}
          {activeWorkflowTab === 'image' ? (
            <ImageGenPanel scene={activeScene} />
          ) : (
            <VideoGenPanel scene={activeScene} />
          )}
        </main>
      </div>
    </div>
  );
}
