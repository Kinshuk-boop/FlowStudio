'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useProjectStore } from '@/store/useProjectStore';
import TopNav from '@/components/navigation/TopNav';
import AssetGrid from '@/components/assets/AssetGrid';

export default function AssetsPage() {
  const params = useParams();
  const projectId = params?.id as string;
  const { setActiveProject, getActiveProject } = useProjectStore();

  React.useEffect(() => {
    if (projectId) {
      setActiveProject(projectId);
    }
  }, [projectId, setActiveProject]);

  const currentProject = getActiveProject();

  if (!currentProject) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400 text-xs">
        Loading Asset Library...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />

      <main className="flex-1 max-w-7xl w-full mx-auto p-5 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/8">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Project Asset Library
            </h1>
            <p className="text-xs text-zinc-400">
              Browse, filter, and inspect all synthesized images and video motion clips generated across scenes.
            </p>
          </div>
        </div>

        <AssetGrid />
      </main>
    </div>
  );
}
