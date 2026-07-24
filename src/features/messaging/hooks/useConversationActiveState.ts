import { useStore } from '@/store/store'
import { useEffect, useState } from 'react'

const useConversationActiveState = (conversationId: string, initialIsActive: boolean) => {
  const socket = useStore((state) => state.messaging.socket)
  const [isActive, setIsActive] = useState(initialIsActive)

  useEffect(() => {
    if (!socket) return
    const handler = (data: { conversationId: string; isActive: boolean }) => {
      if (data.conversationId === conversationId) setIsActive(data.isActive)
    }
    socket.on('conversation:status_changed', handler)
    return () => {
      socket.off('conversation:status_changed', handler)
    }
  }, [socket, conversationId])

  return isActive
}

export default useConversationActiveState
