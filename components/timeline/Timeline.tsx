'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { useTimelineStore } from '@/store/useTimelineStore';
import { Scene } from '@/lib/types/project';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipBack, 
  SkipForward, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Film, 
  Sparkles, 
  Download, 
  Clock, 
  Sliders, 
  Volume2, 
  Maximize,
  ArrowRightLeft,
  GripHorizontal
} from 'lucide-react';

export default function Timeline() {
  const { getActiveProject, reorderScenes, updateSceneDuration, updateSceneTransition } = useProjectStore();
  const { 
    isPlaying, 
    togglePlay, 
    currentTime, 
    setCurrentTime, 
    playbackSpeed, 
    setPlaybackSpeed, 
    zoomLevel, 
    setZoomLevel,
    isSnapToGrid,
    toggleSnapToGrid,
    selectedClipIndex,
    setSelectedClipIndex,
    previewQuality,
    setPreviewQuality,
    aspectRatio,
    setAspectRatio,
    exportFormat,
    setExportFormat
  } = useTimelineStore();

  const project = getActiveProject();
  const scenes = project?.scenes || [];
  const trackRef = useRef<HTMLDivElement | null>(null);

  const totalDuration = scenes.reduce((acc, s) => acc + (s.durationSeconds || 5), 0);

  // Playback timer ticker
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(currentTime + 0.1 * playbackSpeed);
        if (currentTime >= totalDuration) {
          setCurrentTime(0);
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, totalDuration, playbackSpeed, setCurrentTime]);

  // Determine active playing scene based on currentTime
  let accumulatedTime = 0;
  let activeSceneIndex = 0;
  for (let i = 0; i < scenes.length; i++) {
    const dur = scenes[i].durationSeconds || 5;
    if (currentTime >= accumulatedTime && currentTime < accumulatedTime + dur) {
      activeSceneIndex = i;
      break;
    }
    accumulatedTime += dur;
  }

  const currentPlayingScene = scenes[activeSceneIndex] || scenes[0];
  const activeMedia = currentPlayingScene?.generatedAssets.find((a) => a.type === 'video') ||
    currentPlayingScene?.generatedAssets.find((a) => a.id === currentPlayingScene.selectedImageId) ||
    currentPlayingScene?.generatedAssets[0];

  const formatTimecode = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 24);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    setCurrentTime(ratio * totalDuration);
  };

  const cycleTransition = (sceneId: string, current: string = 'cut') => {
    const order: Array<'cut' | 'crossfade' | 'dissolve' | 'wipe'> = ['cut', 'crossfade', 'dissolve', 'wipe'];
    const nextIdx = (order.indexOf(current as any) + 1) % order.length;
    if (project) {
      updateSceneTransition(project.id, sceneId, order[nextIdx]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar: Transport & Playback Bar */}
      <div className="glass-panel p-3 rounded-xl flex items-center justify-between gap-4">
        {/* Left: Transport Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentTime(0)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white"
            title="Rewind to Start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentTime(Math.max(0, currentTime - 1))}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white"
            title="Step -1s"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="px-4 py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 font-medium text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-black" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-black" /> Play Sequence
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentTime(Math.min(totalDuration, currentTime + 1))}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white"
            title="Step +1s"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Timecode display */}
          <div className="ml-2 px-2.5 py-1 rounded-md bg-black/60 border border-white/10 font-mono text-xs text-white">
            <span className="text-blue-400">{formatTimecode(currentTime)}</span>
            <span className="text-zinc-500 mx-1.5">/</span>
            <span className="text-zinc-400">{formatTimecode(totalDuration)}</span>
          </div>
        </div>

        {/* Right: Zoom & Track Settings */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-lg border border-white/5">
            <ZoomOut className="w-3 h-3 text-zinc-500" />
            <input
              type="range"
              min="0.6"
              max="1.8"
              step="0.1"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
              className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <ZoomIn className="w-3 h-3 text-zinc-500" />
          </div>

          <button
            type="button"
            onClick={toggleSnapToGrid}
            className={`px-2.5 py-1 rounded-md transition-colors border ${
              isSnapToGrid
                ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                : 'bg-white/5 border-white/8 text-zinc-400'
            }`}
          >
            Snap Grid
          </button>
        </div>
      </div>

      {/* Storyboard & Timeline Track Area */}
      <div className="glass-panel p-4 rounded-xl space-y-3 overflow-hidden">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-1 border-b border-white/5">
          <span>STORYBOARD SEQUENCE ({scenes.length} CLIPS)</span>
          <span>TIMESCALE 24 FPS</span>
        </div>

        {/* Horizontal Scrollable Clips Row */}
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          className="relative py-4 overflow-x-auto min-h-[140px] cursor-pointer selection:bg-transparent"
        >
          {/* Playhead Vertical Line */}
          {totalDuration > 0 && (
            <div
              className="absolute top-0 bottom-0 z-30 pointer-events-none flex flex-col items-center transition-all"
              style={{
                left: `${(currentTime / totalDuration) * 100}%`,
              }}
            >
              <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg -mt-1.5 border border-white" />
              <div className="w-0.5 h-full bg-red-500/90 shadow-sm" />
            </div>
          )}

          {/* Storyboard Clips Grid */}
          <div
            className="flex items-center gap-2 relative z-10"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'left center' }}
          >
            {scenes.map((scene, idx) => {
              const isSelected = selectedClipIndex === idx;
              const isCurrentlyPlaying = activeSceneIndex === idx;
              const clipThumb = scene.generatedAssets.find(
                (a) => a.id === scene.selectedImageId
              )?.url || scene.generatedAssets[0]?.url;

              const hasVideo = !!scene.selectedVideoId || scene.generatedAssets.some((a) => a.type === 'video');

              return (
                <React.Fragment key={scene.id}>
                  {/* Scene Clip Card */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedClipIndex(idx);
                      // Calculate offset to jump playhead to clip start
                      let startOffset = 0;
                      for (let k = 0; k < idx; k++) {
                        startOffset += scenes[k].durationSeconds || 5;
                      }
                      setCurrentTime(startOffset);
                    }}
                    className={`relative w-48 rounded-xl overflow-hidden glass-panel border transition-all duration-200 cursor-pointer group flex-shrink-0 ${
                      isCurrentlyPlaying
                        ? 'border-blue-500 ring-2 ring-blue-500/30'
                        : isSelected
                        ? 'border-white/40 ring-1 ring-white/20'
                        : 'border-white/10 hover:border-white/25'
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="relative aspect-video bg-black/60 overflow-hidden">
                      {clipThumb ? (
                        <img
                          src={clipThumb}
                          alt={scene.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          <Film className="w-6 h-6" />
                        </div>
                      )}

                      {/* Video vs Image Badge */}
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur text-[9px] font-mono text-zinc-300 flex items-center gap-1">
                        {hasVideo ? 'VIDEO' : 'STILL'}
                      </span>

                      {/* Scene Index */}
                      <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur text-[9px] font-mono text-white">
                        #{idx + 1}
                      </span>
                    </div>

                    {/* Clip Footer */}
                    <div className="p-2 bg-[#0d0e13]/90 flex items-center justify-between border-t border-white/5">
                      <span className="text-[11px] font-medium text-white truncate max-w-[110px]">
                        {scene.name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded">
                        {scene.durationSeconds || 5}s
                      </span>
                    </div>
                  </div>

                  {/* Transition connector between clips */}
                  {idx < scenes.length - 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        cycleTransition(scene.id, scene.transitionToNext || 'cut');
                      }}
                      className="flex-shrink-0 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/8 text-[10px] font-mono uppercase text-zinc-400 hover:text-white transition-all flex items-center gap-1"
                      title="Click to cycle transition (Cut / Dissolve / Crossfade / Wipe)"
                    >
                      <ArrowRightLeft className="w-2.5 h-2.5" />
                      {scene.transitionToNext || 'cut'}
                    </button>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Timescale Ruler */}
        <div className="h-4 border-t border-white/10 flex items-center justify-between font-mono text-[9px] text-zinc-500 pt-1">
          <span>00:00:00</span>
          <span>00:00:15</span>
          <span>00:00:30</span>
          <span>00:00:45</span>
          <span>{formatTimecode(totalDuration)}</span>
        </div>
      </div>

      {/* Dual Bottom Inspector: Video Player Preview & Sequence Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Synchronized Live Video Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="glass-panel p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
                  Master Output Monitor
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                  {currentPlayingScene?.name || 'Live Frame'}
                </span>
              </div>

              <span className="text-[11px] font-mono text-blue-400">
                {previewQuality} HDR · 24fps
              </span>
            </div>

            {/* Main Video Monitor */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-white/10 group">
              {activeMedia?.type === 'video' ? (
                <video
                  src={activeMedia.url}
                  autoPlay={isPlaying}
                  controls={false}
                  loop
                  className="w-full h-full object-cover"
                />
              ) : activeMedia ? (
                <img
                  src={activeMedia.url}
                  alt={currentPlayingScene?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                  <Film className="w-8 h-8" />
                </div>
              )}

              {/* Timestamp Overlay */}
              <div className="absolute bottom-2 left-2 z-20 px-2 py-1 rounded bg-black/80 backdrop-blur font-mono text-xs text-white">
                {formatTimecode(currentTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sequence & Export Configuration (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-4 rounded-xl space-y-4">
            <h3 className="text-xs font-semibold text-white tracking-wide uppercase font-mono flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-zinc-400" />
              Sequence Properties
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-zinc-400">Total Runtime</span>
                <span className="font-mono text-white font-medium">
                  {totalDuration} seconds ({scenes.length} shots)
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-zinc-400">Aspect Ratio</span>
                <div className="flex items-center gap-1">
                  {(['16:9', '9:16', '1:1', '2.39:1'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setAspectRatio(r)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                        aspectRatio === r
                          ? 'bg-white/10 text-white border-white/20'
                          : 'bg-white/3 text-zinc-400 border-white/5'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-zinc-400">Master Codec</span>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="px-2 py-1 text-xs rounded-md glass-input bg-[#121319]"
                >
                  <option value="MP4 (H.264)">MP4 (H.264 High)</option>
                  <option value="ProRes 422">Apple ProRes 422 HQ</option>
                  <option value="WebM">WebM VP9</option>
                </select>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-zinc-400">Render Resolution</span>
                <select
                  value={previewQuality}
                  onChange={(e) => setPreviewQuality(e.target.value as any)}
                  className="px-2 py-1 text-xs rounded-md glass-input bg-[#121319]"
                >
                  <option value="1080p">1920 × 1080 (FHD)</option>
                  <option value="4k">3840 × 2160 (4K UHD)</option>
                  <option value="720p">1280 × 720 (HD)</option>
                </select>
              </div>
            </div>

            {/* Export Master Sequence CTA */}
            <button
              type="button"
              onClick={() => alert(`Stitching and rendering master ${exportFormat} film (${totalDuration}s)...`)}
              className="w-full py-2.5 px-4 rounded-lg bg-white text-black hover:bg-zinc-200 font-medium text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
            >
              <Download className="w-3.5 h-3.5" />
              Render &amp; Export Master Film
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
