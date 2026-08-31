'use client';

import React from 'react';
import { Sliders, Code } from 'lucide-react';

interface PromptModeToggleProps {
  mode: 'form' | 'json';
  onModeChange: (mode: 'form' | 'json') => void;
}

export default function PromptModeToggle({ mode, onModeChange }: PromptModeToggleProps) {
  return (
    <div className="flex items-center p-0.5 rounded-lg bg-black/40 border border-white/8 text-xs">
      <button
        type="button"
        onClick={() => onModeChange('form')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
          mode === 'form'
            ? 'bg-white/10 text-white shadow-sm border border-white/10'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Sliders className="w-3 h-3" />
        Form Builder
      </button>

      <button
        type="button"
        onClick={() => onModeChange('json')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
          mode === 'json'
            ? 'bg-white/10 text-white shadow-sm border border-white/10'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Code className="w-3 h-3" />
        Raw JSON
      </button>
    </div>
  );
}
