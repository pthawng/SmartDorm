import { useMessaging } from '../hooks/useMessaging';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { Loading } from '@/shared/ui';

/**
 * Airbnb-style 'Messaging Feature' — orchestrates the high-fidelity communication portal.
 * Implements a 30/70 split-screen layout with fluid responsiveness.
 */
export function MessagingFeature() {
  const { 
    conversations, 
    activeConversation, 
    selectConversation, 
    sendMessage, 
    isLoading 
  } = useMessaging();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loading message="Loading your conversations..." />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] w-full flex overflow-hidden bg-white animate-in fade-in duration-700">
      {/* 1. Sidebar - Conversation List (30% Split) */}
      <aside className="w-full md:w-[400px] lg:w-[480px] flex-shrink-0 border-r border-slate-100/50">
        <ConversationList 
          conversations={conversations} 
          activeId={activeConversation?.id} 
          onSelect={selectConversation} 
        />
      </aside>

      {/* 2. Main - Chat Window (Fluid 70% Split) */}
      <main className="flex-1 min-w-0 bg-slate-50/20 relative">
        <ChatWindow 
          activeConversation={activeConversation} 
          onSendMessage={sendMessage} 
        />
      </main>
    </div>
  );
}
