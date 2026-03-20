export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export interface UserStatus {
  isOnline: boolean;
  lastSeen?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  status: MessageStatus;
  isMe: boolean;
  attachments?: string[];
}

export interface Conversation {
  id: string;
  participantName: string;
  participantAvatar?: string;
  participantRole: 'Landlord' | 'Support' | 'Tenant';
  lastMessageSnippet: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  status: UserStatus;
  messages: Message[];
}

export interface MessagingData {
  conversations: Conversation[];
  activeConversationId?: string;
}
