import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { GetNotificationsResponse } from '../store/types'

const useMarkNotificationRead = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosPrivate.patch(`/notifications/${id}/read`)
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications', 'list'] })

      const previousList = queryClient.getQueryData<InfiniteData<GetNotificationsResponse>>([
        'notifications',
        'list',
      ])
      const previousCount = queryClient.getQueryData<number>(['notifications', 'unread-count'])

      let wasUnread = false
      queryClient.setQueryData<InfiniteData<GetNotificationsResponse>>(
        ['notifications', 'list'],
        (data) => {
          if (!data) return data
          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              data: page.data.map((notification) => {
                if (notification.id !== id) return notification
                if (!notification.isRead) wasUnread = true
                return { ...notification, isRead: true }
              }),
            })),
          }
        }
      )

      if (wasUnread) {
        queryClient.setQueryData<number>(['notifications', 'unread-count'], (count) =>
          Math.max(0, (count ?? 1) - 1)
        )
      }

      return { previousList, previousCount }
    },
    onError: (_error, _id, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(['notifications', 'list'], context.previousList)
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(['notifications', 'unread-count'], context.previousCount)
      }
    },
  })
}

export default useMarkNotificationRead
