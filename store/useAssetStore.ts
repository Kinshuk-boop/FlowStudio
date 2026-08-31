import { create } from 'zustand';
import { Asset, AssetType } from '@/lib/types/asset';

interface AssetState {
  filterType: 'all' | 'image' | 'video';
  filterSceneId: string | 'all';
  searchQuery: string;
  previewAsset: Asset | null;
  selectedAssetIds: string[];

  // Actions
  setFilterType: (type: 'all' | 'image' | 'video') => void;
  setFilterSceneId: (sceneId: string | 'all') => void;
  setSearchQuery: (query: string) => void;
  setPreviewAsset: (asset: Asset | null) => void;
  toggleAssetSelection: (assetId: string) => void;
  clearSelection: () => void;
}

export const useAssetStore = create<AssetState>((set) => ({
  filterType: 'all',
  filterSceneId: 'all',
  searchQuery: '',
  previewAsset: null,
  selectedAssetIds: [],

  setFilterType: (type) => set({ filterType: type }),
  setFilterSceneId: (sceneId) => set({ filterSceneId: sceneId }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPreviewAsset: (asset) => set({ previewAsset: asset }),

  toggleAssetSelection: (assetId) =>
    set((state) => ({
      selectedAssetIds: state.selectedAssetIds.includes(assetId)
        ? state.selectedAssetIds.filter((id) => id !== assetId)
        : [...state.selectedAssetIds, assetId],
    })),

  clearSelection: () => set({ selectedAssetIds: [] }),
}));
