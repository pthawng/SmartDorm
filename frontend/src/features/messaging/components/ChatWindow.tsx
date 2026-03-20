import { Conversation } from '../types';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { MessageCircle } from 'lucide-react';

interface ChatWindowProps {
  activeConversation?: Conversation;
  onSendMessage: (id: string, content: string) => void;
}

/**
 * Airbnb-style 'Chat Window' — the primary real-time communication portal.
 * Orchestrates high-fidelity message flows with a distraction-free spotlight feel.
 */
export function ChatWindow({ activeConversation, onSendMessage }: ChatWindowProps) {
  if (!activeConversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50/30 text-center space-y-8 animate-in fade-in duration-700">
        <div className="h-24 w-24 rounded-[2.5rem] bg-white flex items-center justify-center text-slate-200 shadow-xl shadow-slate-100 border border-slate-50">
          <MessageCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2 max-w-xs">
          <p className="text-xl font-black text-slate-900 tracking-tight">Select a conversation</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Start a high-fidelity dialogue with your residence landlord or support team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white animate-in fade-in slide-in-from-right-4 duration-500">
      <ChatHeader conversation={activeConversation} />
      <MessageList messages={activeConversation.messages} />
      <MessageInput 
        onSend={(content) => onSendMessage(activeConversation.id, content)} 
      />
    </div>
  );
}
