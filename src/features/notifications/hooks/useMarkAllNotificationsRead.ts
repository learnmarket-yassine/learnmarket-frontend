import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { GetNotificationsResponse } from '../store/types'

const useMarkAllNotificationsRead = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await axiosPrivate.patch('/notifications/read-all')
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications', 'list'] })

      const previousList = queryClient.getQueryData<InfiniteData<GetNotificationsResponse>>([
        'notifications',
        'list',
      ])
      const previousCount = queryClient.getQueryData<number>(['notifications', 'unread-count'])

      queryClient.setQueryData<InfiniteData<GetNotificationsResponse>>(
        ['notifications', 'list'],
        (data) => {
          if (!data) return data
          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              data: page.data.map((notification) => ({
                ...notification,
                isRead: true,
              })),
            })),
          }
        }
      )
      queryClient.setQueryData<number>(['notifications', 'unread-count'], 0)

      return { previousList, previousCount }
    },
    onError: (_error, _vars, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(['notifications', 'list'], context.previousList)
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(['notifications', 'unread-count'], context.previousCount)
      }
    },
  })
}

export default useMarkAllNotificationsRead
