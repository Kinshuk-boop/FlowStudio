'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DotGridBackground from '@/components/canvas/DotGridBackground';
import {
  Clapperboard,
  Sliders,
  Sparkles,
  Film,
  ArrowRight,
  Play,
  ChevronRight,
  Check,
  Zap,
  Camera,
  Layers,
} from 'lucide-react';

// ──── Dot-grid-style mini mockup component ────
function AppMockup() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
      style={{
        background: 'rgba(10,10,15,0.95)',
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* Mock Window Chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-white/3">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <span className="ml-3 text-[11px] font-mono text-zinc-400">
          Desert Odyssey — Scene 3: The Shelter — Image Studio
        </span>
      </div>

      {/* Mock Content */}
      <div className="grid grid-cols-5 min-h-[340px]">
        {/* Left: Scene Sidebar (narrow) */}
        <div className="col-span-1 border-r border-white/8 p-3 space-y-1.5">
          {[
            { n: '1', label: 'The Arrival', active: false },
            { n: '2', label: 'Sandstorm', active: false },
            { n: '3', label: 'The Shelter', active: true },
            { n: '4', label: 'Relic', active: false },
            { n: '5', label: 'Departure', active: false },
          ].map((s) => (
            <div
              key={s.n}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] transition-colors ${
                s.active
                  ? 'bg-blue-500/15 border border-blue-500/30 text-blue-300'
                  : 'text-zinc-500 hover:bg-white/5'
              }`}
            >
              <span className="font-mono w-3">{s.n}</span>
              <span className="truncate">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Center: Prompt Editor */}
        <div className="col-span-2 border-r border-white/8 p-3">
          <div className="text-[10px] font-mono text-zinc-500 mb-2">image_prompt.json</div>
          <div className="space-y-0.5 font-mono text-[10px] leading-relaxed">
            <div><span className="text-zinc-600">{'{'}</span></div>
            <div className="pl-2"><span className="text-blue-400">&quot;type&quot;</span><span className="text-zinc-600">: </span><span className="text-emerald-400">&quot;image&quot;</span><span className="text-zinc-600">,</span></div>
            <div className="pl-2"><span className="text-blue-400">&quot;prompt&quot;</span><span className="text-zinc-600">: </span><span className="text-amber-300/80">&quot;A lone astronaut in a weathered spacesuit...&quot;</span><span className="text-zinc-600">,</span></div>
            <div className="pl-2"><span className="text-blue-400">&quot;style&quot;</span><span className="text-zinc-600">: </span><span className="text-emerald-400">&quot;Photorealistic IMAX&quot;</span><span className="text-zinc-600">,</span></div>
            <div className="pl-2"><span className="text-blue-400">&quot;aspect_ratio&quot;</span><span className="text-zinc-600">: </span><span className="text-emerald-400">&quot;16:9&quot;</span><span className="text-zinc-600">,</span></div>
            <div className="pl-2"><span className="text-blue-400">&quot;num_outputs&quot;</span><span className="text-zinc-600">: </span><span className="text-violet-300">4</span><span className="text-zinc-600">,</span></div>
            <div className="pl-2"><span className="text-blue-400">&quot;seed&quot;</span><span className="text-zinc-600">: </span><span className="text-violet-300">12345</span></div>
            <div><span className="text-zinc-600">{'}'}</span></div>
          </div>

          {/* Progress bar at bottom */}
          <div className="mt-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center justify-between text-[9px] mb-1">
              <span className="text-blue-400 font-mono">Denoising latents...</span>
              <span className="text-blue-300 font-mono">78%</span>
            </div>
            <div className="h-1 bg-black/40 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-blue-500 rounded-full" style={{ boxShadow: '0 0 8px rgba(59,130,246,0.6)' }} />
            </div>
          </div>
        </div>

        {/* Right: 2×2 Generated Images */}
        <div className="col-span-2 p-3">
          <div className="text-[10px] font-mono text-zinc-500 mb-2">4 Candidates</div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=200&q=60', selected: true },
              { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=200&q=60', selected: false },
              { url: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=200&q=60', selected: false },
              { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&q=60', selected: false },
            ].map((img, i) => (
              <div
                key={i}
                className={`relative aspect-video rounded-md overflow-hidden border transition-all ${
                  img.selected ? 'border-blue-500' : 'border-white/10'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                {img.selected && (
                  <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="px-4 py-2 border-t border-white/8 bg-white/2 flex items-center gap-4 font-mono text-[9px] text-zinc-500">
        <span className="flex items-center gap-1 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Types Valid
        </span>
        <span>↺ Auto-saved</span>
        <span>⚡ 4 Candidates Generated</span>
        <span>Seed: 12345</span>
      </div>
    </div>
  );
}

// ──── Feature Card ────
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-5 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/5 hover:border-white/15 transition-all duration-300 group">
      <div className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-zinc-300 mb-4 group-hover:border-white/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] overflow-x-hidden">
      {/* Dot-grid physics background */}
      <DotGridBackground />

      {/* ── Top Navigation ── */}
      <nav className="relative z-20 w-full h-14 border-b border-white/8 bg-[#09090b]/80 backdrop-blur-xl px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-white/10 border border-white/15 flex items-center justify-center text-white">
            <Clapperboard className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold tracking-tight text-white text-sm">FLOW</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">
            Studio
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">Docs</a>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/auth"
            className="px-3.5 py-1.5 text-xs text-zinc-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth?tab=signup"
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-black bg-white hover:bg-zinc-200 transition-all shadow-sm active:scale-95"
          >
            Start Creating
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center pt-28 pb-20 px-6">
        {/* Public preview badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/12 bg-white/5 text-[11px] text-zinc-300 font-mono mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Now in Public Preview — AI Filmmaking Suite
          <ChevronRight className="w-3 h-3 text-zinc-500" />
        </div>

        {/* Giant H1 */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] max-w-4xl mb-6">
          Craft Cinematic
          <br />
          <span className="text-zinc-400">Films with AI</span>
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg text-zinc-400 max-w-xl leading-relaxed mb-10">
          Structured generative prompting, keyframe synthesis, motion generation, and sequence storyboarding — all in one professional workspace.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-12">
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-black bg-white hover:bg-zinc-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] active:scale-[0.98]"
          >
            Start Filming Free
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            href="#features"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Watch Demo
          </Link>
        </div>

        {/* Stats Row */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 font-mono text-[12px] text-zinc-500">
          <span>12,000+ Sequences Created</span>
          <span className="hidden sm:block text-zinc-700">·</span>
          <span>4M+ Frames Synthesized</span>
          <span className="hidden sm:block text-zinc-700">·</span>
          <span>340+ Studios</span>
        </div>
      </section>

      {/* ── App Mockup Preview ── */}
      <section id="workflow" className="relative z-10 px-4 md:px-8 pb-24 max-w-5xl mx-auto">
        <AppMockup />
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="relative z-10 px-4 md:px-8 pb-24 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
            Everything you need to direct with AI
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto">
            From prompt engineering to final export — every stage of the AI filmmaking pipeline built for precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard
            icon={<Sliders className="w-4.5 h-4.5" />}
            title="Structured Prompt Engine"
            desc="Form Builder ↔ Raw JSON live sync. Full Zod-validated schemas for image and video prompts with camera controls, lighting presets, and seed management."
          />
          <FeatureCard
            icon={<Sparkles className="w-4.5 h-4.5" />}
            title="AI Generation Pipeline"
            desc="Multi-stage async inference for keyframe images and video motion clips with live progress tracking, job queue, and batch outputs up to 4x per scene."
          />
          <FeatureCard
            icon={<Film className="w-4.5 h-4.5" />}
            title="Timeline Storyboard"
            desc="Drag-and-drop scene sequencing with transition controls, synchronized timecode ruler, video playback monitor, and master export to ProRes / H.264."
          />
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative z-10 px-4 md:px-8 pb-28 max-w-5xl mx-auto">
        <div className="rounded-2xl border border-white/10 bg-white/3 p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
            Ready to direct your first AI film?
          </h2>
          <p className="text-sm text-zinc-400 mb-6 max-w-md mx-auto">
            Start free with the Desert Odyssey demo project. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-black bg-white hover:bg-zinc-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.12)] active:scale-95"
            >
              Open Studio Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/auth?tab=signup"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Or create an account →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/8 px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-white/10 border border-white/15 flex items-center justify-center">
            <Clapperboard className="w-3 h-3 text-zinc-300" />
          </div>
          <span className="font-medium text-zinc-400">FLOW Studio</span>
          <span>© 2026</span>
        </div>

        <div className="flex items-center gap-5">
          <a href="#" className="hover:text-zinc-300 transition-colors">Privacy</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Terms</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Status</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">GitHub</a>
        </div>
      </footer>
    </div>
  );
}
