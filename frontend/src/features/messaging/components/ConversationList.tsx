import * as React from 'react';
import { Conversation } from '../types';
import { ConversationItem } from './ConversationItem';
import { Search } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
}

/**
 * Airbnb-style 'Conversation List' — provides a searchable overview of active dialogues.
 * Features a minimalist search bar and a scrollable list of high-fidelity items.
 */
export function ConversationList({ conversations, activeId, onSelect }: ConversationListProps) {
  const [search, setSearch] = React.useState('');

  const filteredConversations = conversations.filter(c => 
    c.participantName.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessageSnippet.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-100">
      <div className="p-8 space-y-8">
        <header className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Resident Support</p>
        </header>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2 scrollbar-hide">
        {filteredConversations.length === 0 ? (
          <div className="py-20 text-center space-y-4">
             <div className="h-12 w-12 rounded-full bg-slate-50 mx-auto flex items-center justify-center text-slate-300">
                <Search className="w-6 h-6" />
             </div>
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest px-8">No conversations found for "{search}"</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationItem 
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === activeId}
              onClick={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}
