import { cn } from '@/shared/utils';
import { Message } from '../types';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

/**
 * Airbnb-style 'Message Bubble' — clean, high-contrast, and deeply rounded.
 * Distinct visual hierarchy for sent vs received states, including delivery receipts.
 */
export function MessageBubble({ message }: MessageBubbleProps) {
  const isMe = message.isMe;

  return (
    <div className={cn(
      "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
      isMe ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[70%] group flex flex-col gap-2",
        isMe ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-6 py-4 text-sm font-medium transition-all duration-300",
          isMe 
            ? "bg-primary-600 text-white rounded-[2rem] rounded-tr-none shadow-lg shadow-primary-100" 
            : "bg-slate-100/80 text-slate-900 rounded-[2rem] rounded-tl-none backdrop-blur-sm"
        )}>
          {message.content}
        </div>

        <div className="flex items-center gap-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {message.timestamp}
          </span>
          {isMe && (
            <div className="flex items-center">
              {message.status === 'read' ? (
                <CheckCheck className="w-3 h-3 text-primary-500" />
              ) : (
                <Check className="w-3 h-3 text-slate-300" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
