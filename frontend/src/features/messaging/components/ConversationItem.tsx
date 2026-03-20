import { cn } from '@/shared/utils';
import { Conversation } from '../types';
import { StatusDot } from '@/shared/ui/StatusDot';
import { Badge } from '@/shared/ui';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: (id: string) => void;
}

/**
 * Airbnb-style 'Conversation Item' — prioritizes snippet clarity and status.
 * Features high-fidelity avatars and unread badges.
 */
export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  return (
    <div 
      onClick={() => onClick(conversation.id)}
      className={cn(
        "group p-6 cursor-pointer transition-all duration-300 rounded-[2rem] flex items-center gap-5 border border-transparent",
        isActive 
          ? "bg-primary-50/50 border-primary-100/50 shadow-sm" 
          : "hover:bg-slate-50"
      )}
    >
      <div className="relative flex-shrink-0">
        <div className="h-16 w-16 rounded-full overflow-hidden shadow-sm ring-4 ring-white">
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

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between">
          <p className={cn(
            "text-sm font-black tracking-tight truncate",
            isActive || conversation.unreadCount > 0 ? "text-slate-900" : "text-slate-600"
          )}>
            {conversation.participantName}
          </p>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {conversation.lastMessageTimestamp}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className={cn(
            "text-xs truncate max-w-[180px]",
            conversation.unreadCount > 0 ? "text-slate-900 font-black" : "text-slate-400 font-medium"
          )}>
            {conversation.lastMessageSnippet}
          </p>
          {conversation.unreadCount > 0 && (
            <Badge variant="info" className="h-5 min-w-5 px-1 flex items-center justify-center text-[9px] font-black rounded-full shadow-lg shadow-primary-100 bg-primary-600 text-white border-none">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
