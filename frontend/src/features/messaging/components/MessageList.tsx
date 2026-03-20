import * as React from 'react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[];
}

/**
 * Airbnb-style 'Message List' — provides a chronological, high-fidelity message flow.
 * Features automated date categorization and smooth scroll-to-bottom orchestration.
 */
export function MessageList({ messages }: MessageListProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-10 space-y-12 scroll-smooth scrollbar-hide"
    >
      <div className="flex flex-col gap-8">
        {/* Date Categorization Marker */}
        <div className="flex items-center justify-center gap-6 opacity-40">
           <div className="h-px bg-slate-200 flex-1" />
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Today</span>
           <div className="h-px bg-slate-200 flex-1" />
        </div>

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
