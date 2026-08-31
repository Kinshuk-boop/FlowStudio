import { create } from 'zustand';
import { Project, Scene } from '@/lib/types/project';
import { ImagePrompt, VideoPrompt } from '@/lib/types/prompt';
import { Asset } from '@/lib/types/asset';

const DEFAULT_SCENES: Scene[] = [
  {
    id: 'scene_1',
    projectId: 'proj_desert_odyssey',
    order: 0,
    name: 'Scene 1: The Arrival',
    description: 'A lone scout vessel touches down on the crimson sand dunes.',
    durationSeconds: 6,
    selectedImageId: 'asset_init_1',
    selectedVideoId: 'asset_vid_init_1',
    imagePrompt: {
      type: 'image',
      prompt: 'Cinematic wide angle shot of a weathered scout ship landing on vast red sand dunes, twin suns setting on the horizon, golden rim light, atmospheric dust haze',
      negative_prompt: 'blurry, watermark, text, low quality, oversaturated',
      style: 'Cinematic 35mm, Panavision Ultra',
      aspect_ratio: '16:9',
      camera: {
        angle: 'low angle',
        lens: '35mm standard',
        shot: 'wide shot',
      },
      lighting: 'Golden hour twilight with dual rim glow',
      seed: 81921,
      num_outputs: 4,
    },
    videoPrompt: {
      type: 'video',
      source_image_id: 'asset_init_1',
      source_image_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
      motion_prompt: 'Slow cinematic push in as thruster heat distortion shimmers and red dust billows across the landing struts',
      camera_motion: 'slow dolly in',
      duration_seconds: 5,
      fps: 24,
      aspect_ratio: '16:9',
      loop: false,
      seed: 81921,
    },
    generatedAssets: [
      {
        id: 'asset_init_1',
        projectId: 'proj_desert_odyssey',
        sceneId: 'scene_1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
        seed: 81921,
        status: 'done',
        aspectRatio: '16:9',
        promptText: 'A weathered scout ship landing on red dunes...',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'asset_vid_init_1',
        projectId: 'proj_desert_odyssey',
        sceneId: 'scene_1',
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
        seed: 81921,
        status: 'done',
        aspectRatio: '16:9',
        durationSeconds: 5,
        promptText: 'Slow push in with dust shimmering...',
        createdAt: new Date(Date.now() - 3000000).toISOString(),
      }
    ],
    transitionToNext: 'dissolve',
  },
  {
    id: 'scene_2',
    projectId: 'proj_desert_odyssey',
    order: 1,
    name: 'Scene 2: Sandstorm Surge',
    description: 'A violent wall of crimson dust rushes across the desert basin.',
    durationSeconds: 5,
    selectedImageId: 'asset_init_2',
    selectedVideoId: 'asset_vid_init_2',
    imagePrompt: {
      type: 'image',
      prompt: 'Dramatic extreme wide shot of a colossal towering sandstorm engulfing ancient obsidian monoliths in the desert, electric storm sparks in clouds',
      negative_prompt: 'cartoon, blurry, low resolution',
      style: 'Dark sci-fi cinematic, Roger Deakins tone',
      aspect_ratio: '16:9',
      camera: {
        angle: 'low angle',
        lens: '24mm wide',
        shot: 'extreme wide shot',
      },
      lighting: 'Dark overcast storm with amber flashes',
      seed: 49204,
      num_outputs: 4,
    },
    videoPrompt: {
      type: 'video',
      source_image_id: 'asset_init_2',
      source_image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
      motion_prompt: 'Fast tracking shot sweeping across monoliths as the storm front advances with howling wind particles',
      camera_motion: 'drone forward tracking',
      duration_seconds: 5,
      fps: 24,
      aspect_ratio: '16:9',
      loop: false,
      seed: 49204,
    },
    generatedAssets: [
      {
        id: 'asset_init_2',
        projectId: 'proj_desert_odyssey',
        sceneId: 'scene_2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
        seed: 49204,
        status: 'done',
        aspectRatio: '16:9',
        promptText: 'Towering sandstorm engulfing monoliths...',
        createdAt: new Date(Date.now() - 2500000).toISOString(),
      },
      {
        id: 'asset_vid_init_2',
        projectId: 'proj_desert_odyssey',
        sceneId: 'scene_2',
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
        seed: 49204,
        status: 'done',
        aspectRatio: '16:9',
        durationSeconds: 5,
        promptText: 'Fast tracking shot sweeping across monoliths...',
        createdAt: new Date(Date.now() - 2000000).toISOString(),
      }
    ],
    transitionToNext: 'cut',
  },
  {
    id: 'scene_3',
    projectId: 'proj_desert_odyssey',
    order: 2,
    name: 'Scene 3: The Shelter',
    description: 'An explorer finds refuge inside a carved cavern as the storm roars outside.',
    durationSeconds: 7,
    selectedImageId: 'asset_init_3',
    imagePrompt: {
      type: 'image',
      prompt: 'A lone astronaut in a weathered spacesuit taking shelter inside a cavern overlooking a raging desert storm, warm lantern glow contrasting cold exterior blue light',
      negative_prompt: 'deformed, blurry, watermark',
      style: 'Photorealistic IMAX, 70mm grain',
      aspect_ratio: '16:9',
      camera: {
        angle: 'eye level',
        lens: '35mm standard',
        shot: 'medium shot',
      },
      lighting: 'Warm orange key light, deep cavern ambient shadows',
      seed: 12345,
      num_outputs: 4,
    },
    videoPrompt: {
      type: 'video',
      source_image_id: 'asset_init_3',
      source_image_url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1600&q=80',
      motion_prompt: 'Camera slowly pushes in as dust swirls around the astronaut boots, lantern light flickering softly',
      camera_motion: 'slow dolly in',
      duration_seconds: 5,
      fps: 24,
      aspect_ratio: '16:9',
      loop: false,
      seed: 12345,
    },
    generatedAssets: [
      {
        id: 'asset_init_3',
        projectId: 'proj_desert_odyssey',
        sceneId: 'scene_3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1600&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1600&q=80',
        seed: 12345,
        status: 'done',
        aspectRatio: '16:9',
        promptText: 'Astronaut in cavern overlooking desert...',
        createdAt: new Date(Date.now() - 1500000).toISOString(),
      },
      {
        id: 'asset_init_3_alt1',
        projectId: 'proj_desert_odyssey',
        sceneId: 'scene_3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1600&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1600&q=80',
        seed: 12346,
        status: 'done',
        aspectRatio: '16:9',
        promptText: 'Cavern interior shot with dust particles...',
        createdAt: new Date(Date.now() - 1400000).toISOString(),
      }
    ],
    transitionToNext: 'crossfade',
  },
  {
    id: 'scene_4',
    projectId: 'proj_desert_odyssey',
    order: 3,
    name: 'Scene 4: Ancient Relic',
    description: 'Deep in the caverns, an alien beacon pulses with cyan bioluminescence.',
    durationSeconds: 5,
    selectedImageId: 'asset_init_4',
    selectedVideoId: 'asset_vid_init_4',
    imagePrompt: {
      type: 'image',
      prompt: 'Glowing crystalline artifact hovering inside an ancient subterranean chamber, geometric runes floating in cyan light, volumetric dust rays',
      negative_prompt: 'low quality, oversaturated, messy',
      style: 'Cinematic sci-fi, Denis Villeneuve aesthetic',
      aspect_ratio: '16:9',
      camera: {
        angle: 'low angle',
        lens: '50mm prime',
        shot: 'close up',
      },
      lighting: 'Bioluminescent cyan core with dark stone falloff',
      seed: 92817,
      num_outputs: 4,
    },
    videoPrompt: {
      type: 'video',
      source_image_id: 'asset_init_4',
      source_image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
      motion_prompt: 'Smooth orbital camera rotating around the glowing beacon as light pulses emanate outward',
      camera_motion: 'orbit clockwise',
      duration_seconds: 5,
      fps: 24,
      aspect_ratio: '16:9',
      loop: false,
      seed: 92817,
    },
    generatedAssets: [
      {
        id: 'asset_init_4',
        projectId: 'proj_desert_odyssey',
        sceneId: 'scene_4',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80',
        seed: 92817,
        status: 'done',
        aspectRatio: '16:9',
        promptText: 'Glowing crystalline artifact in chamber...',
        createdAt: new Date(Date.now() - 1000000).toISOString(),
      },
      {
        id: 'asset_vid_init_4',
        projectId: 'proj_desert_odyssey',
        sceneId: 'scene_4',
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80',
        seed: 92817,
        status: 'done',
        aspectRatio: '16:9',
        durationSeconds: 5,
        promptText: 'Smooth orbital camera rotating around beacon...',
        createdAt: new Date(Date.now() - 800000).toISOString(),
      }
    ],
    transitionToNext: 'cut',
  },
  {
    id: 'scene_5',
    projectId: 'proj_desert_odyssey',
    order: 4,
    name: 'Scene 5: The Departure',
    description: 'The ship ascends into the upper atmosphere as the twin suns eclipse.',
    durationSeconds: 6,
    selectedImageId: 'asset_init_5',
    imagePrompt: {
      type: 'image',
      prompt: 'Epic cinematic shot of a spacecraft ascending into the red stratosphere, twin suns forming an eclipse behind planetary rings, lens flare',
      negative_prompt: 'blurry, amateur, noisy',
      style: 'Epic space opera, Nolan Interstellar style',
      aspect_ratio: '16:9',
      camera: {
        angle: 'low angle',
        lens: '24mm wide',
        shot: 'wide shot',
      },
      lighting: 'High contrast solar eclipse with lens flare',
      seed: 66120,
      num_outputs: 4,
    },
    videoPrompt: {
      type: 'video',
      source_image_id: 'asset_init_5',
      source_image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
      motion_prompt: 'Camera tilts up following the spacecraft as thruster plumes ignite and the ship breaks through atmospheric clouds',
      camera_motion: 'tilt up',
      duration_seconds: 6,
      fps: 24,
      aspect_ratio: '16:9',
      loop: false,
      seed: 66120,
    },
    generatedAssets: [
      {
        id: 'asset_init_5',
        projectId: 'proj_desert_odyssey',
        sceneId: 'scene_5',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
        seed: 66120,
        status: 'done',
        aspectRatio: '16:9',
        promptText: 'Spacecraft ascending into red stratosphere...',
        createdAt: new Date(Date.now() - 500000).toISOString(),
      }
    ],
    transitionToNext: 'cut',
  },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_desert_odyssey',
    name: 'Desert Odyssey',
    description: 'A cinematic science fiction expedition across an uncharted desert world.',
    aspectRatio: '16:9',
    fps: 24,
    resolution: '1920x1080',
    scenes: DEFAULT_SCENES,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'proj_neon_city',
    name: 'Neon Metropolis 2099',
    description: 'Cyberpunk neo-noir investigative thriller in rain-drenched megastructures.',
    aspectRatio: '16:9',
    fps: 24,
    resolution: '1920x1080',
    scenes: [],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'proj_deep_nebula',
    name: 'Void Drift',
    description: 'Deep space anomaly exploration at the threshold of a gravitational rift.',
    aspectRatio: '16:9',
    fps: 24,
    resolution: '3840x2160',
    scenes: [],
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'proj_alpine_peak',
    name: 'Glacier Protocol',
    description: 'Sub-zero high altitude survival mission through treacherous mountain passes.',
    aspectRatio: '16:9',
    fps: 24,
    resolution: '1920x1080',
    scenes: [],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  },
];

interface ProjectState {
  projects: Project[];
  activeProjectId: string;
  activeSceneId: string;
  
  // Actions
  getActiveProject: () => Project | undefined;
  getActiveScene: () => Scene | undefined;
  setActiveProject: (projectId: string) => void;
  setActiveScene: (sceneId: string) => void;
  
  createProject: (name: string, description?: string) => Project;
  deleteProject: (projectId: string) => void;
  
  addScene: (projectId: string, name?: string) => Scene;
  deleteScene: (projectId: string, sceneId: string) => void;
  reorderScenes: (projectId: string, scenes: Scene[]) => void;
  
  updateSceneImagePrompt: (projectId: string, sceneId: string, prompt: ImagePrompt) => void;
  updateSceneVideoPrompt: (projectId: string, sceneId: string, prompt: VideoPrompt) => void;
  updateSceneDuration: (projectId: string, sceneId: string, durationSeconds: number) => void;
  updateSceneTransition: (projectId: string, sceneId: string, transition: 'cut' | 'crossfade' | 'dissolve' | 'wipe') => void;
  
  selectSceneImage: (projectId: string, sceneId: string, assetId: string) => void;
  selectSceneVideo: (projectId: string, sceneId: string, assetId: string) => void;
  addGeneratedAssetsToScene: (projectId: string, sceneId: string, assets: Asset[]) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: INITIAL_PROJECTS,
  activeProjectId: 'proj_desert_odyssey',
  activeSceneId: 'scene_3',

  getActiveProject: () => {
    const { projects, activeProjectId } = get();
    return projects.find((p) => p.id === activeProjectId);
  },

  getActiveScene: () => {
    const project = get().getActiveProject();
    if (!project) return undefined;
    const { activeSceneId } = get();
    return project.scenes.find((s) => s.id === activeSceneId) || project.scenes[0];
  },

  setActiveProject: (projectId: string) => {
    const project = get().projects.find((p) => p.id === projectId);
    set({
      activeProjectId: projectId,
      activeSceneId: project?.scenes[0]?.id || '',
    });
  },

  setActiveScene: (sceneId: string) => {
    set({ activeSceneId: sceneId });
  },

  createProject: (name: string, description?: string) => {
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      name,
      description: description || 'New filmmaking project sequence',
      aspectRatio: '16:9',
      fps: 24,
      resolution: '1920x1080',
      scenes: [
        {
          id: `scene_${Date.now()}_1`,
          projectId: `proj_${Date.now()}`,
          order: 0,
          name: 'Scene 1: Opening Shot',
          durationSeconds: 5,
          imagePrompt: {
            type: 'image',
            prompt: 'Cinematic wide establishing shot of a futuristic metropolis surrounded by dramatic clouds',
            aspect_ratio: '16:9',
            num_outputs: 4,
          },
          videoPrompt: {
            type: 'video',
            source_image_id: '',
            motion_prompt: 'Slow dolly in across the cityscape',
            camera_motion: 'slow dolly in',
            duration_seconds: 5,
            fps: 24,
            aspect_ratio: '16:9',
            loop: false,
          },
          generatedAssets: [],
          transitionToNext: 'cut',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      projects: [newProj, ...state.projects],
      activeProjectId: newProj.id,
      activeSceneId: newProj.scenes[0].id,
    }));

    return newProj;
  },

  deleteProject: (projectId: string) => {
    set((state) => {
      const remaining = state.projects.filter((p) => p.id !== projectId);
      return {
        projects: remaining,
        activeProjectId: remaining[0]?.id || '',
        activeSceneId: remaining[0]?.scenes[0]?.id || '',
      };
    });
  },

  addScene: (projectId: string, name?: string) => {
    let createdScene: Scene | undefined;

    set((state) => {
      const projects = state.projects.map((proj) => {
        if (proj.id !== projectId) return proj;

        const newOrder = proj.scenes.length;
        const newSceneId = `scene_${Date.now()}_${newOrder + 1}`;
        createdScene = {
          id: newSceneId,
          projectId,
          order: newOrder,
          name: name || `Scene ${newOrder + 1}: Shot ${newOrder + 1}`,
          durationSeconds: 5,
          imagePrompt: {
            type: 'image',
            prompt: 'Cinematic dramatic shot with rich atmospheric lighting',
            aspect_ratio: '16:9',
            num_outputs: 4,
          },
          videoPrompt: {
            type: 'video',
            source_image_id: '',
            motion_prompt: 'Slow cinematic tracking camera movement',
            camera_motion: 'slow dolly in',
            duration_seconds: 5,
            fps: 24,
            aspect_ratio: '16:9',
            loop: false,
          },
          generatedAssets: [],
          transitionToNext: 'cut',
        };

        return {
          ...proj,
          scenes: [...proj.scenes, createdScene],
          updatedAt: new Date().toISOString(),
        };
      });

      return {
        projects,
        activeSceneId: createdScene?.id || state.activeSceneId,
      };
    });

    return createdScene!;
  },

  deleteScene: (projectId: string, sceneId: string) => {
    set((state) => {
      const projects = state.projects.map((proj) => {
        if (proj.id !== projectId) return proj;
        const filtered = proj.scenes
          .filter((s) => s.id !== sceneId)
          .map((s, idx) => ({ ...s, order: idx }));
        return {
          ...proj,
          scenes: filtered,
          updatedAt: new Date().toISOString(),
        };
      });

      const currentProj = projects.find((p) => p.id === projectId);
      const newActive = currentProj?.scenes[0]?.id || '';

      return {
        projects,
        activeSceneId: state.activeSceneId === sceneId ? newActive : state.activeSceneId,
      };
    });
  },

  reorderScenes: (projectId: string, reordered: Scene[]) => {
    set((state) => ({
      projects: state.projects.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          scenes: reordered.map((s, idx) => ({ ...s, order: idx })),
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  },

  updateSceneImagePrompt: (projectId: string, sceneId: string, prompt: ImagePrompt) => {
    set((state) => ({
      projects: state.projects.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          scenes: proj.scenes.map((scene) =>
            scene.id === sceneId ? { ...scene, imagePrompt: prompt } : scene
          ),
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  },

  updateSceneVideoPrompt: (projectId: string, sceneId: string, prompt: VideoPrompt) => {
    set((state) => ({
      projects: state.projects.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          scenes: proj.scenes.map((scene) =>
            scene.id === sceneId ? { ...scene, videoPrompt: prompt } : scene
          ),
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  },

  updateSceneDuration: (projectId: string, sceneId: string, durationSeconds: number) => {
    set((state) => ({
      projects: state.projects.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          scenes: proj.scenes.map((scene) =>
            scene.id === sceneId ? { ...scene, durationSeconds } : scene
          ),
        };
      }),
    }));
  },

  updateSceneTransition: (projectId: string, sceneId: string, transition: 'cut' | 'crossfade' | 'dissolve' | 'wipe') => {
    set((state) => ({
      projects: state.projects.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          scenes: proj.scenes.map((scene) =>
            scene.id === sceneId ? { ...scene, transitionToNext: transition } : scene
          ),
        };
      }),
    }));
  },

  selectSceneImage: (projectId: string, sceneId: string, assetId: string) => {
    set((state) => ({
      projects: state.projects.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          scenes: proj.scenes.map((scene) => {
            if (scene.id !== sceneId) return scene;
            const asset = scene.generatedAssets.find((a) => a.id === assetId);
            return {
              ...scene,
              selectedImageId: assetId,
              videoPrompt: {
                ...scene.videoPrompt,
                source_image_id: assetId,
                source_image_url: asset?.url || scene.videoPrompt.source_image_url,
              },
            };
          }),
        };
      }),
    }));
  },

  selectSceneVideo: (projectId: string, sceneId: string, assetId: string) => {
    set((state) => ({
      projects: state.projects.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          scenes: proj.scenes.map((scene) =>
            scene.id === sceneId ? { ...scene, selectedVideoId: assetId } : scene
          ),
        };
      }),
    }));
  },

  addGeneratedAssetsToScene: (projectId: string, sceneId: string, assets: Asset[]) => {
    set((state) => ({
      projects: state.projects.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          scenes: proj.scenes.map((scene) => {
            if (scene.id !== sceneId) return scene;
            const existingIds = new Set(scene.generatedAssets.map((a) => a.id));
            const newAssets = assets.filter((a) => !existingIds.has(a.id));
            const updatedList = [...newAssets, ...scene.generatedAssets];
            
            // Auto-select first generated image if none selected
            const firstImage = updatedList.find((a) => a.type === 'image');
            const firstVideo = updatedList.find((a) => a.type === 'video');

            return {
              ...scene,
              generatedAssets: updatedList,
              selectedImageId: scene.selectedImageId || firstImage?.id,
              selectedVideoId: scene.selectedVideoId || firstVideo?.id,
            };
          }),
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  },
}));
