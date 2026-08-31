'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/store/useProjectStore';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Clapperboard, 
  Plus, 
  Film, 
  Search, 
  Trash2, 
  ArrowUpRight,
  LogOut,
  Loader2
} from 'lucide-react';

export default function ProjectsDashboard() {
  const router = useRouter();
  const { projects, setActiveProject, createProject, deleteProject } = useProjectStore();
  const { user, logout, actionLoading } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');  

  const handleSignOut = async () => {
    await logout();
    router.replace('/auth');
  };

  // Get user display initials
  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?';

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalScenes = projects.reduce((acc, p) => acc + p.scenes.length, 0);
  const totalAssets = projects.reduce(
    (acc, p) => acc + p.scenes.reduce((sAcc, s) => sAcc + s.generatedAssets.length, 0),
    0
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    const created = createProject(newProjectName.trim(), newProjectDesc.trim());
    setIsCreateModalOpen(false);
    setNewProjectName('');
    setNewProjectDesc('');
    router.push(`/project/${created.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="w-full h-16 border-b border-white/8 bg-[#0a0b0f]/80 backdrop-blur-xl px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white">
            <Clapperboard className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
              FLOW
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-zinc-400">
                Workspace
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64 hidden sm:block">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg glass-input"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 font-medium text-xs shadow-md transition-all active:scale-[0.99]"
          >
            <Plus className="w-3.5 h-3.5" />
            New Project
          </button>

          {/* User avatar + sign out */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName ?? 'User'}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[10px] font-bold text-zinc-300">
                {initials}
              </div>
            )}
            <button
              type="button"
              onClick={handleSignOut}
              disabled={actionLoading}
              title="Sign out"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/8 transition-all disabled:opacity-50"
            >
              {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Hero Title & Stats Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Film Projects
            </h2>
            <p className="text-xs text-zinc-400 max-w-lg">
              Create and sequence scenes using structured generative prompting, latent keyframing, and video motion synthesis.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg glass-panel text-zinc-300">
              <span className="text-white font-semibold">{projects.length}</span> Projects
            </div>
            <div className="px-3 py-1.5 rounded-lg glass-panel text-zinc-300">
              <span className="text-white font-semibold">{totalScenes}</span> Scenes
            </div>
            <div className="px-3 py-1.5 rounded-lg glass-panel text-zinc-300">
              <span className="text-white font-semibold">{totalAssets}</span> Generated Media
            </div>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const sceneCount = project.scenes.length;
            const assetCount = project.scenes.reduce(
              (acc, s) => acc + s.generatedAssets.length,
              0
            );

            return (
              <div
                key={project.id}
                onClick={() => {
                  setActiveProject(project.id);
                  router.push(`/project/${project.id}`);
                }}
                className="group relative rounded-2xl overflow-hidden glass-panel border border-white/8 hover:border-white/20 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1 shadow-lg hover:shadow-2xl"
              >
                {/* Thumbnail Preview Area */}
                <div className="relative aspect-video w-full bg-black/60 overflow-hidden">
                  {project.thumbnailUrl ? (
                    <img
                      src={project.thumbnailUrl}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Film className="w-8 h-8" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-transparent to-transparent opacity-80" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur border border-white/10 text-[10px] font-mono text-zinc-300">
                      {project.aspectRatio || '16:9'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur border border-white/10 text-[10px] font-mono text-zinc-300">
                      {project.resolution || '1080p'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 z-20">
                    <h3 className="text-base font-semibold text-white truncate flex items-center justify-between">
                      {project.name}
                      <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                    </h3>
                  </div>
                </div>

                {/* Card Content & Metadata */}
                <div className="p-4 space-y-3 bg-[#0d0e14]/90 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {project.description || 'No description provided.'}
                  </p>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <div className="flex items-center gap-3">
                      <span>{sceneCount} Shots</span>
                      <span>•</span>
                      <span>{assetCount} Assets</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete project "${project.name}"?`)) {
                          deleteProject(project.id);
                        }
                      }}
                      className="p-1 rounded text-zinc-600 hover:text-red-400 hover:bg-white/5 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* "+ Start New Project" Card */}
          <div
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-2xl border border-dashed border-white/15 hover:border-white/30 bg-black/20 hover:bg-white/3 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-8 text-center min-h-[260px] group"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white mb-3 transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">
              Create New Project
            </h3>
            <p className="text-xs text-zinc-500 max-w-xs">
              Start a fresh filmmaking sequence with structured prompting and AI camera workflows.
            </p>
          </div>
        </div>
      </main>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="absolute inset-0" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl glass-panel-elevated p-6 z-10 space-y-4">
            <h3 className="text-base font-semibold text-white">
              Create New Film Project
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Cyber Runner 2088"
                  className="w-full px-3 py-2 text-xs rounded-lg glass-input"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Logline / Description
                </label>
                <textarea
                  rows={2}
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Brief synopsis of the cinematic world or narrative..."
                  className="w-full px-3 py-2 text-xs rounded-lg glass-input resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 font-medium text-xs"
                >
                  Create &amp; Open
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
