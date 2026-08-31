'use client';

import React, { useState, useEffect } from 'react';
import { ImagePrompt } from '@/lib/types/prompt';
import { ImagePromptSchema } from '@/lib/schema/imagePrompt.schema';
import { Copy, Check, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface PromptJsonEditorProps {
  prompt: ImagePrompt;
  onChange: (prompt: ImagePrompt) => void;
}

export default function PromptJsonEditor({ prompt, onChange }: PromptJsonEditorProps) {
  const [jsonString, setJsonString] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync external prompt object into text representation
  useEffect(() => {
    try {
      setJsonString(JSON.stringify(prompt, null, 2));
      setError(null);
    } catch {
      // ignore
    }
  }, [prompt]);

  const handleTextChange = (text: string) => {
    setJsonString(text);

    try {
      const parsed = JSON.parse(text);
      const validation = ImagePromptSchema.safeParse(parsed);

      if (!validation.success) {
        const firstErr = validation.error.issues[0];
        setError(`${firstErr.path.join('.') || 'root'}: ${firstErr.message}`);
      } else {
        setError(null);
        onChange(validation.data as ImagePrompt);
      }
    } catch (err: any) {
      setError(`Invalid JSON syntax: ${err.message}`);
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonString);
      setJsonString(JSON.stringify(parsed, null, 2));
    } catch {
      // ignore
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400">image_prompt.json</span>
          {!error && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              <Check className="w-3 h-3" /> Valid Schema
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleFormat}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 transition-colors"
            title="Prettify JSON"
          >
            <Sparkles className="w-3 h-3" />
            Format
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="relative rounded-lg overflow-hidden border border-white/10 bg-[#08090c] focus-within:border-white/25 transition-colors">
        <textarea
          value={jsonString}
          onChange={(e) => handleTextChange(e.target.value)}
          rows={16}
          spellCheck={false}
          className="w-full p-3 font-mono text-xs text-zinc-200 bg-transparent resize-none leading-relaxed focus:outline-none selection:bg-blue-500/30"
          placeholder="{\n  &quot;type&quot;: &quot;image&quot;,\n  &quot;prompt&quot;: &quot;...&quot;\n}"
        />
      </div>

      {/* Inline Schema Error Banner */}
      {error && (
        <div className="flex items-start gap-2 p-2.5 rounded-md bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-mono">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
          <div className="break-all">{error}</div>
        </div>
      )}
    </div>
  );
}
