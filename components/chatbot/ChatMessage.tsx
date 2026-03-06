'use client';

import { Message } from './types';

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div className="w-full py-6">

      {/* ASSISTANT MESSAGE */}
      {!isUser && (
        <div className="flex gap-4">

          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
            M
          </div>

          <div className="prose dark:prose-invert max-w-none text-[15px] leading-7">
            {message.content}
          </div>
        </div>
      )}

      {/* USER MESSAGE */}
      {isUser && (
        <div className="flex justify-end">
          <div className="max-w-[65%] bg-gray-100 dark:bg-gray-800 px-5 py-3 rounded-3xl text-[15px] leading-relaxed">
            {message.content}
          </div>
        </div>
      )}

    </div>
  );
}
