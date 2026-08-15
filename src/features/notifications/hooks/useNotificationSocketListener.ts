import { useEffect } from 'react'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@/store/store'
import { GetNotificationsResponse, Notification } from '../store/types'

const useNotificationSocketListener = () => {
  const socket = useStore((state) => state.notifications.socket)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket) return

    const handleNotification = (notification: Notification) => {
      queryClient.setQueryData<InfiniteData<GetNotificationsResponse>>(
        ['notifications', 'list'],
        (data) => {
          if (!data) return data
          const [firstPage, ...rest] = data.pages
          return {
            ...data,
            pages: [
              {
                ...firstPage,
                data: [notification, ...firstPage.data],
                total: firstPage.total + 1,
              },
              ...rest,
            ],
          }
        }
      )

      queryClient.setQueryData<number>(
        ['notifications', 'unread-count'],
        (count) => (count ?? 0) + 1
      )
    }

    socket.on('notification', handleNotification)
    return () => {
      socket.off('notification', handleNotification)
    }
  }, [socket, queryClient])
}

export default useNotificationSocketListener
