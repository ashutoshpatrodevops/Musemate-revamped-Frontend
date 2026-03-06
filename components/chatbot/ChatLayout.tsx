'use client';

import { useState } from 'react';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { Message } from './types';
import { ChatHeader } from './ChatHeader';
import { WelcomeScreen } from './WelcomeScreen';

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
      content: text
    };

    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now()+1).toString(),
        role: 'assistant',
        content: "This is where your AI response will appear. Replace with API."
      };

      setMessages(prev => [...prev, aiMsg]);
      setTyping(false);
    }, 900);
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
