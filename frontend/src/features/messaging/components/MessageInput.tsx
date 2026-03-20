import * as React from 'react';
import { Paperclip, Smile, Send } from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

/**
 * Airbnb-style 'Message Input' — a minimalist, utility-rich interaction zone.
 * Features frictionless attachment management and a primary Send CTA.
 */
export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [content, setContent] = React.useState('');

  const handleSend = () => {
    if (content.trim()) {
      onSend(content);
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-8 pb-10 bg-white border-t border-slate-50">
      <div className="max-w-4xl mx-auto relative group">
        <textarea 
          rows={1}
          placeholder="Message landlord..."
          value={content}
          disabled={disabled}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full min-h-[64px] py-5 pl-16 pr-24 bg-slate-50 border-none rounded-[2rem] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-primary-50 transition-all resize-none shadow-sm"
        />

        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
           <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-white rounded-full transition-all">
             <Paperclip className="w-5 h-5" />
           </button>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
           <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-white rounded-full transition-all">
             <Smile className="w-5 h-5" />
           </button>
           <button 
             onClick={handleSend}
             disabled={!content.trim() || disabled}
             className="h-10 w-10 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-primary-200 hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 disabled:shadow-none"
           >
             <Send className="w-4 h-4 ml-0.5" />
           </button>
        </div>
      </div>
      <p className="text-center mt-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">
        Press Shift + Enter for new line • End-to-End Encrypted
      </p>
    </div>
  );
}
