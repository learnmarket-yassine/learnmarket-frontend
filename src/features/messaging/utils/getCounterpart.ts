import { Conversation, ConversationParticipant } from '../store/types'

export function getCounterpart(
  conversation: Conversation,
  currentUserId: string | undefined
): ConversationParticipant {
  return conversation.tutorId === currentUserId ? conversation.learner : conversation.tutor
}
