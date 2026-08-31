'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useProjectStore } from '@/store/useProjectStore';
import { useGenerationStore } from '@/store/useGenerationStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Clapperboard, Film, Sparkles, Download, Layers, Play, ChevronDown, Check, LogOut, Loader2 } from 'lucide-react';

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { projects, activeProjectId, setActiveProject, getActiveProject } = useProjectStore();
  const { isGeneratingImage, isGeneratingVideo, activeJobs } = useGenerationStore();
  const { user, logout, actionLoading } = useAuthStore();

  const currentProject = getActiveProject();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?';

  const handleSignOut = async () => {
    await logout();
    router.replace('/auth');
  };

  const isWorkspace = pathname.includes('/scene') || pathname === `/project/${activeProjectId}` || (pathname.startsWith('/project/') && !pathname.includes('/timeline') && !pathname.includes('/assets'));
  const isTimeline = pathname.includes('/timeline');
  const isAssets = pathname.includes('/assets');

  const activeJobCount = activeJobs.length;

  return (
    <header className="sticky top-0 z-40 w-full h-14 border-b border-[var(--border)] bg-[#0c0d12]/80 backdrop-blur-xl px-4 flex items-center justify-between">
      {/* Left: Brand & Project Switcher */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-2 py-1 rounded-md hover:bg-white/5 transition-colors group"
        >
          <div className="w-7 h-7 rounded-md bg-white/10 border border-white/15 flex items-center justify-center text-white group-hover:border-white/30 transition-colors">
            <Clapperboard className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold tracking-tight text-[15px] text-white">
            FLOW
          </span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">
            Studio
          </span>
        </Link>

        <span className="text-zinc-600 text-sm">/</span>

        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
          >
            <Film className="w-3.5 h-3.5 text-zinc-400" />
            <span className="max-w-[140px] truncate">{currentProject?.name || 'Select Project'}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-1.5 w-60 z-50 rounded-lg bg-[#14151c] border border-white/10 p-1 shadow-2xl backdrop-blur-2xl">
                <div className="px-2.5 py-1.5 text-[11px] font-mono uppercase text-zinc-500">
                  Projects
                </div>
                {projects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setActiveProject(proj.id);
                      setIsDropdownOpen(false);
                      router.push(`/project/${proj.id}`);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-left transition-colors ${
                      proj.id === activeProjectId
                        ? 'bg-white/10 text-white font-medium'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="truncate">{proj.name}</span>
                    {proj.id === activeProjectId && (
                      <Check className="w-3.5 h-3.5 text-blue-400" />
                    )}
                  </button>
                ))}
                <div className="my-1 border-t border-white/5" />
                <Link
                  href="/"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block w-full px-2.5 py-1.5 rounded-md text-xs text-zinc-400 hover:text-white hover:bg-white/5"
                >
                  View All Projects &rarr;
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Center: Workspace Navigation Tabs */}
      {currentProject && (
        <nav className="flex items-center p-0.5 rounded-lg bg-black/40 border border-white/5">
          <Link
            href={`/project/${currentProject.id}`}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              isWorkspace
                ? 'bg-white/10 text-white shadow-sm border border-white/10'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Workspace
          </Link>
          <Link
            href={`/project/${currentProject.id}/timeline`}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              isTimeline
                ? 'bg-white/10 text-white shadow-sm border border-white/10'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            Timeline
          </Link>
          <Link
            href={`/project/${currentProject.id}/assets`}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              isAssets
                ? 'bg-white/10 text-white shadow-sm border border-white/10'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Assets
          </Link>
        </nav>
      )}

      {/* Right: Status & Actions */}
      <div className="flex items-center gap-2.5">
        {/* Active Generation Indicator */}
        {(isGeneratingImage || isGeneratingVideo) && (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            <span>Rendering ({activeJobCount})</span>
          </div>
        )}

        <Link
          href={`/project/${activeProjectId}/timeline`}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white transition-all"
        >
          <Play className="w-3 h-3" />
          Preview
        </Link>

        <button
          onClick={() => alert(`Exporting ${currentProject?.name || 'Project'} to 1080p MP4 master sequence...`)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium text-black bg-white hover:bg-zinc-200 transition-all shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>

        {/* User avatar + sign out */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName ?? 'User'}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[9px] font-bold text-zinc-300">
              {initials}
            </div>
          )}
          <button
            onClick={handleSignOut}
            disabled={actionLoading}
            title="Sign out"
            className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-white/8 transition-all disabled:opacity-50"
          >
            {actionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <LogOut className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </header>
  );
}
