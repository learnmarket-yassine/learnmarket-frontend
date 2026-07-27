import { useEffect, useState } from 'react'
import { useStore } from '@/store/store'

export type ParticipantRole = 'TUTOR' | 'LEARNER'

export interface ParticipantJoinedEvent {
  sessionId: string
  role: ParticipantRole
  joinedAt: string
}

export function useSessionRoomSocket(sessionId: string) {
  const socket = useStore((state) => state.sessionsSocket.socket)
  const [lastJoined, setLastJoined] = useState<ParticipantJoinedEvent | null>(null)

  useEffect(() => {
    if (!socket || !sessionId) return

    const joinRoom = () => socket.emit('session:join', { sessionId })
    joinRoom()
    socket.on('connect', joinRoom)

    const handleJoined = (event: ParticipantJoinedEvent) => {
      if (event.sessionId !== sessionId) return
      setLastJoined(event)
    }
    socket.on('session:participant_joined', handleJoined)

    return () => {
      socket.emit('session:leave', { sessionId })
      socket.off('connect', joinRoom)
      socket.off('session:participant_joined', handleJoined)
    }
  }, [socket, sessionId])

  return { lastJoined }
}
