'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { WelcomeScreen } from './WelcomeScreen';
import { Message } from './types';

interface ChatWindowProps {
  userName?: string;
}

export function ChatWindow({ userName = 'Explorer' }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I received your message: "' + content + '". This is a placeholder response.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    /* FIXED: h-screen and overflow-hidden prevent the whole page from scrolling */
    <div className="flex flex-col h-screen max-h-screen bg-white dark:bg-gray-950 transition-colors overflow-hidden">
      
      {/* FIXED: flex-1 and overflow-y-auto ensure only this section scrolls */}
      <div className="flex-1 overflow-y-auto scroll-smooth">
        {messages.length === 0 ? (
          <WelcomeScreen userName={userName} onPrompt={handleSendMessage} />
        ) : (
          <div className="max-w-3xl mx-auto w-full px-4 py-8">
            <ChatMessages messages={messages} />
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* FIXED: The input bar now sits at the bottom of the flex column naturally */}
      <div className="w-full px-4 pb-8 pt-2 bg-gradient-to-t from-white dark:from-gray-950 via-white dark:via-gray-950 to-transparent">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSendMessage} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
}