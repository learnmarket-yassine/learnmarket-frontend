import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useStore } from '@/store/store'

const useMarkConversationRead = () => {
  const socket = useStore((state) => state.messaging.socket)
  const queryClient = useQueryClient()

  return useCallback(
    (conversationId: string) => {
      if (!socket) return
      socket.emit('message:read', { conversationId }, () => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] })
      })
    },
    [socket, queryClient]
  )
}

export default useMarkConversationRead
