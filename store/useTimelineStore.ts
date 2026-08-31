import { create } from 'zustand';

interface TimelineState {
  isPlaying: boolean;
  currentTime: number; // in seconds
  playbackSpeed: number; // 0.5, 1, 1.5, 2
  zoomLevel: number; // 0.5 to 2.5
  isSnapToGrid: boolean;
  selectedClipIndex: number | null;
  previewQuality: '1080p' | '4k' | '720p';
  aspectRatio: '16:9' | '9:16' | '1:1' | '2.39:1';
  exportFormat: 'MP4 (H.264)' | 'ProRes 422' | 'WebM';

  // Actions
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setZoomLevel: (zoom: number) => void;
  toggleSnapToGrid: () => void;
  setSelectedClipIndex: (index: number | null) => void;
  setPreviewQuality: (quality: '1080p' | '4k' | '720p') => void;
  setAspectRatio: (ratio: '16:9' | '9:16' | '1:1' | '2.39:1') => void;
  setExportFormat: (format: 'MP4 (H.264)' | 'ProRes 422' | 'WebM') => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  isPlaying: false,
  currentTime: 0,
  playbackSpeed: 1,
  zoomLevel: 1,
  isSnapToGrid: true,
  selectedClipIndex: 0,
  previewQuality: '1080p',
  aspectRatio: '16:9',
  exportFormat: 'MP4 (H.264)',

  setIsPlaying: (playing) => set({ isPlaying: playing }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setCurrentTime: (time) => set({ currentTime: Math.max(0, time) }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
  toggleSnapToGrid: () => set((state) => ({ isSnapToGrid: !state.isSnapToGrid })),
  setSelectedClipIndex: (index) => set({ selectedClipIndex: index }),
  setPreviewQuality: (quality) => set({ previewQuality: quality }),
  setAspectRatio: (ratio) => set({ aspectRatio: ratio }),
  setExportFormat: (format) => set({ exportFormat: format }),
}));
