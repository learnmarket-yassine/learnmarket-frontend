import { createSocketConnection, destroySocketConnection } from '@/lib/socket-manager'
import { useStore } from '@/store/store'
import { useEffect } from 'react'

export function useSocketConnection() {
  const accessToken = useStore((state) => state.auth.authenticationResult?.token)
  const setSocket = useStore((state) => state.messaging.setSocket)

  useEffect(() => {
    if (!accessToken) return

    createSocketConnection(accessToken, (socket) => setSocket(socket))

    return () => {
      destroySocketConnection()
      setSocket(null)
    }
  }, [accessToken, setSocket])
}
