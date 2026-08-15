import {
  createNotificationsSocketConnection,
  destroyNotificationsSocketConnection,
} from '@/lib/notifications-socket-manager'
import { useStore } from '@/store/store'
import { useEffect } from 'react'

export function useNotificationsSocketConnection() {
  const accessToken = useStore((state) => state.auth.authenticationResult?.token)
  const setSocket = useStore((state) => state.notifications.setSocket)

  useEffect(() => {
    if (!accessToken) return

    createNotificationsSocketConnection(accessToken, (socket) => setSocket(socket))

    return () => {
      destroyNotificationsSocketConnection()
      setSocket(null)
    }
  }, [accessToken, setSocket])
}
