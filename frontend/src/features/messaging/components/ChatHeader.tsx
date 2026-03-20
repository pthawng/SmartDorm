import { Conversation } from '../types';
import { StatusDot } from '@/shared/ui/StatusDot';
import { MoreHorizontal, Phone, Video } from 'lucide-react';

interface ChatHeaderProps {
  conversation: Conversation;
}

/**
 * Airbnb-style 'Chat Header' — provides context and actions for the active dialogue.
 * Features participant status and premium communication actions.
 */
export function ChatHeader({ conversation }: ChatHeaderProps) {
  return (
    <header className="h-[100px] flex items-center justify-between px-10 border-b border-slate-50 bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm shadow-slate-50">
      <div className="flex items-center gap-5">
        <div className="relative group">
          <div className="h-14 w-14 rounded-full overflow-hidden shadow-sm ring-4 ring-white group-hover:ring-primary-50 transition-all">
            <img 
              src={conversation.participantAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.participantName)}&bg=f1f5f9&color=64748b`} 
              alt={conversation.participantName}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 ring-4 ring-white rounded-full">
             <StatusDot 
               status={conversation.status.isOnline ? 'success' : 'neutral'} 
               pulse={conversation.status.isOnline}
             />
          </div>
        </div>

        <div className="space-y-0.5">
          <p className="text-sm font-black text-slate-900 tracking-tight leading-none">
            {conversation.participantName}
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {conversation.participantRole} • {conversation.status.isOnline ? 'Active Now' : 'Offline'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-3 bg-slate-50 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all border border-slate-100/50">
          <Phone className="w-4 h-4" />
        </button>
        <button className="p-3 bg-slate-50 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all border border-slate-100/50">
          <Video className="w-4 h-4" />
        </button>
        <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
