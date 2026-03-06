'use client';

import { Message } from './types';
import { ChatMessage } from './ChatMessage';

export function ChatMessages({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-1">
      {messages.map(msg => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
    </div>
  );
}
