import { useCallback } from 'react'
import { useQueryClient, InfiniteData } from '@tanstack/react-query'
import { Message, SendMessageAckError } from '../store/types'
import { GetMessagesResponse } from './useGetMessages'
import { useStore } from '@/store/store'

const isAckError = (ack: Message | SendMessageAckError): ack is SendMessageAckError =>
  'error' in ack

const useSendMessage = (conversationId: string) => {
  const queryClient = useQueryClient()
  const currentUserId = useStore((state) => state.auth.user?.id)
  const socket = useStore((state) => state.messaging.socket)

  return useCallback(
    (content: string) => {
      if (!socket || !currentUserId) return

      const optimisticId = `optimistic-${Date.now()}`
      const optimisticMessage: Message = {
        id: optimisticId,
        conversationId,
        content,
        senderId: currentUserId,
        createdAt: new Date().toISOString(),
        readAt: null,
        status: 'SENT',
        sender: { id: currentUserId, firstname: '', lastname: '', avatar: null },
        pending: true,
      }

      const patch = (updater: (messages: Message[]) => Message[]) =>
        queryClient.setQueryData<InfiniteData<GetMessagesResponse>>(
          ['messages', conversationId],
          (old) => {
            if (!old) return old
            return {
              ...old,
              pages: [
                { ...old.pages[0], paginatedResult: updater(old.pages[0].paginatedResult) },
                ...old.pages.slice(1),
              ],
            }
          }
        )

      patch((messages) => [optimisticMessage, ...messages])

      socket.emit(
        'message:send',
        { conversationId, content },
        (ack: Message | SendMessageAckError) => {
          if (isAckError(ack)) {
            patch((messages) => messages.filter((m) => m.id !== optimisticId))
            return
          }
          patch((messages) => {
            const seen = new Set<string>()
            return messages
              .map((m) => (m.id === optimisticId ? ack : m))
              .filter((m) => {
                if (seen.has(m.id)) return false
                seen.add(m.id)
                return true
              })
          })
          queryClient.invalidateQueries({ queryKey: ['conversations'] })
        }
      )
    },
    [socket, conversationId, currentUserId, queryClient]
  )
}

export default useSendMessage
