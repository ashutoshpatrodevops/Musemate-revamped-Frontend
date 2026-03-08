'use client';

import { useState } from 'react';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { Message } from './types';
import { ChatHeader } from './ChatHeader';
import { WelcomeScreen } from './WelcomeScreen';
import { api, endpoints } from '@/lib/api';

type ChatIntent = 'museum_qa' | 'platform_faq' | 'booking' | 'general';

interface ChatSource {
  title: string;
  url?: string;
  type: 'museum' | 'platform' | 'booking';
}

interface ChatResponse {
  intent: ChatIntent;
  reply: string;
  sources: ChatSource[];
  suggestions: string[];
}

function formatAssistantReply(payload: ChatResponse): string {
  const sections: string[] = [payload.reply];

  if (payload.sources.length) {
    const sourceLines = payload.sources
      .slice(0, 3)
      .map((source) => `- ${source.title}${source.url ? ` (${source.url})` : ''}`)
      .join('\n');

    sections.push(`Sources:\n${sourceLines}`);
  }

  if (payload.suggestions.length) {
    const suggestionLines = payload.suggestions
      .slice(0, 3)
      .map((item) => `- ${item}`)
      .join('\n');

    sections.push(`Try asking:\n${suggestionLines}`);
  }

  return sections.join('\n\n');
}

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  function clearChat() {
    setMessages([]);
  }

  async function sendMessage(text: string) {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    try {
      const response = await api.post<ChatResponse>(endpoints.chat.message, {
        message: text,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Could not fetch assistant response');
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: formatAssistantReply(response.data),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'I could not process that just now. Please try again in a moment, or ask a shorter question.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setTyping(false);
    }
  }

  return (
  <div className="flex flex-col h-screen bg-white dark:bg-[#212121]">

    <ChatHeader onClear={clearChat} />

    {/* Scroll Area */}
    <div className="flex-1 overflow-y-auto">
      {messages.length === 0 ? (
    <WelcomeScreen  onPrompt={sendMessage} />
  ) : (
    <div className="max-w-3xl mx-auto px-6 md:px-8 py-10">
      <ChatMessages messages={messages} />
      {typing && <TypingIndicator />}
    </div>
  )}
    </div>

    {/* Input */}
    <div className="px-4 pb-6 pt-2 bg-gradient-to-t from-white dark:from-[#212121] to-transparent">
      <div className="max-w-3xl mx-auto">
        <ChatInput onSend={sendMessage} disabled={typing} />
      </div>
    </div>

  </div>
);

}
