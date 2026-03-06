'use client';

import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

export function ChatInput({ onSend, disabled }: {
  onSend: (msg: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState('');

  function send() {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText('');
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="flex items-end gap-2 px-3 py-3 rounded-2xl border border-gray-300/60 dark:border-gray-700/60
    bg-white/80 dark:bg-[#2b2b2b]/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]">

      <textarea
        rows={1}
        value={text}
        disabled={disabled}
        onChange={e => setText(e.target.value)}
        onKeyDown={onKey}
        placeholder="Message MuseMate..."
        className="flex-1 resize-none bg-transparent outline-none text-[15px] leading-7 py-2 px-2"
      />

      <button
        onClick={send}
        className="bg-black dark:bg-white text-white dark:text-black rounded-xl p-2 disabled:opacity-30"
        disabled={!text.trim()}
      >
        <Send size={18}/>
      </button>

    </div>
  );
}
