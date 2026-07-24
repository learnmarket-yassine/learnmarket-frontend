import { Socket } from 'socket.io-client'

export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ'

export interface ConversationParticipant {
  id: string
  firstname: string
  lastname: string
  avatar: string | null
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  status: MessageStatus
  createdAt: string
  readAt: string | null
  sender: ConversationParticipant
  pending?: boolean
}

export interface Conversation {
  id: string
  tutorId: string
  learnerId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  tutor: ConversationParticipant
  learner: ConversationParticipant
  messages: Message[]
  unreadCount: number
}

export interface SendMessageAckError {
  error: string
  message: string
}

type MessagingState = {
  socket: Socket | null
  setSocket: (socket: Socket | null) => void
}
export type MessagingSlice = {
  messaging: MessagingState
}
