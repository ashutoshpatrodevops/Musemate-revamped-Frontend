'use client';

import { Sparkles, RotateCcw } from 'lucide-react';

export function ChatHeader({ onClear }: { onClear: () => void }) {
  return (
    <div className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 dark:bg-[#212121]/70 border-b border-gray-200/70 dark:border-gray-700/60">
      
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-3 flex items-center justify-between">
        
        {/* Left: Assistant identity */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
            <Sparkles size={14}/>
          </div>

          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              MuseMate
            </p>
            <p className="text-xs text-gray-500">
              AI assistant
            </p>
          </div>
        </div>

        {/* Right: actions */}
        <button
          onClick={onClear}
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          New chat
        </button>

      </div>
    </div>
  );
}
