'use client';

import React from 'react';
import { GenerationJob } from '@/lib/types/job';
import { Loader2, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

interface GenerationJobCardProps {
  job: GenerationJob;
  onCancel?: (jobId: string) => void;
}

export default function GenerationJobCard({ job, onCancel }: GenerationJobCardProps) {
  const isRunning = job.status === 'running' || job.status === 'queued';
  const isDone = job.status === 'done';
  const isFailed = job.status === 'failed';

  return (
    <div className="p-3 rounded-lg bg-[#14151d]/90 border border-white/10 backdrop-blur-xl shadow-lg space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isRunning && (
            <div className="w-5 h-5 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Loader2 className="w-3 h-3 animate-spin" />
            </div>
          )}
          {isDone && (
            <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
            </div>
          )}
          {isFailed && (
            <div className="w-5 h-5 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertCircle className="w-3 h-3" />
            </div>
          )}

          <div>
            <div className="text-xs font-medium text-white flex items-center gap-1.5">
              <span>{job.type === 'image' ? 'Image Generation' : 'Video Motion Synthesis'}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-zinc-400">
                {job.id.slice(-6)}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">
              {job.stageDescription || (isRunning ? 'Processing...' : isDone ? 'Done' : 'Failed')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-zinc-300">
            {job.progress}%
          </span>
          {isRunning && onCancel && (
            <button
              onClick={() => onCancel(job.id)}
              className="p-1 rounded text-zinc-500 hover:text-white hover:bg-white/5"
              title="Cancel Job"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-black/50 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isDone
              ? 'bg-emerald-500'
              : isFailed
              ? 'bg-red-500'
              : 'bg-blue-500'
          }`}
          style={{ width: `${job.progress}%` }}
        />
      </div>
    </div>
  );
}
