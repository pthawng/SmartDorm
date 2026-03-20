import * as React from 'react';
import { MessagingData, Message } from '../types';

/**
 * High-fidelity mock hook for Messaging state management.
 * Provides real-time simulation for conversations and message delivery.
 */
export function useMessaging() {
  const [data, setData] = React.useState<MessagingData>({
    conversations: [
      {
        id: '1',
        participantName: 'Sarah Jenkins',
        participantRole: 'Landlord',
        participantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        lastMessageSnippet: 'That sounds perfect, thanks for the update!',
        lastMessageTimestamp: '2:45 PM',
        unreadCount: 2,
        status: { isOnline: true },
        messages: [
          {
            id: 'm1',
            senderId: 'sarah',
            senderName: 'Sarah Jenkins',
            content: "Hi! Just checking in about the kitchen sink leak I reported earlier this week. Any updates on when someone might be coming by?",
            timestamp: '4:12 PM',
            status: 'read',
            isMe: false
          },
          {
            id: 'm2',
            senderId: 'me',
            senderName: 'Alex Rivers',
            content: "Hello Sarah! Yes, I have a maintenance specialist scheduled for tomorrow morning between 9 AM and 11 AM. Will you be home then?",
            timestamp: '4:15 PM',
            status: 'read',
            isMe: true
          },
          {
            id: 'm3',
            senderId: 'sarah',
            senderName: 'Sarah Jenkins',
            content: "That sounds perfect, thanks for the update on the kitchen repair!",
            timestamp: '2:45 PM',
            status: 'read',
            isMe: false
          }
        ]
      },
      {
        id: '2',
        participantName: 'Michael Chen',
        participantRole: 'Support',
        participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        lastMessageSnippet: 'I\'ve sent the signed lease agreement.',
        lastMessageTimestamp: 'Yesterday',
        unreadCount: 0,
        status: { isOnline: false, lastSeen: '2 hours ago' },
        messages: []
      },
      {
        id: '3',
        participantName: 'Elena Rodriguez',
        participantRole: 'Support',
        participantAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
        lastMessageSnippet: 'Can you confirm the gate code?',
        lastMessageTimestamp: 'Monday',
        unreadCount: 0,
        status: { isOnline: false },
        messages: []
      }
    ],
    activeConversationId: '1'
  });

  const activeConversation = data.conversations.find(c => c.id === data.activeConversationId);

  const selectConversation = (id: string) => {
    setData(prev => ({ 
      ...prev, 
      activeConversationId: id,
      conversations: prev.conversations.map(c => 
        c.id === id ? { ...c, unreadCount: 0 } : c
      )
    }));
  };

  const sendMessage = (id: string, content: string) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'me',
      senderName: 'Alex Rivers',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      isMe: true
    };

    setData(prev => ({
      ...prev,
      conversations: prev.conversations.map(c => 
        c.id === id 
          ? { 
              ...c, 
              messages: [...c.messages, newMessage],
              lastMessageSnippet: content,
              lastMessageTimestamp: 'Just now'
            } 
          : c
      )
    }));
  };

  return {
    conversations: data.conversations,
    activeConversation,
    selectConversation,
    sendMessage,
    isLoading: false
  };
}
