import {
  createSessionSocketConnection,
  destroySessionSocketConnection,
} from '@/lib/session-socket-manager'
import { useStore } from '@/store/store'
import { useEffect } from 'react'

export function useSessionSocketConnection() {
  const accessToken = useStore((state) => state.auth.authenticationResult?.token)
  const setSocket = useStore((state) => state.sessionsSocket.setSocket)

  useEffect(() => {
    if (!accessToken) return

    createSessionSocketConnection(accessToken, (socket) => setSocket(socket))

    return () => {
      destroySessionSocketConnection()
      setSocket(null)
    }
  }, [accessToken, setSocket])
}
