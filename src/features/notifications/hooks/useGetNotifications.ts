import { useInfiniteQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useStore } from '@/store/store'
import { GetNotificationsResponse } from '../store/types'

export const NOTIFICATIONS_PAGE_SIZE = 10

const useGetNotifications = () => {
  const axiosPrivate = useAxiosPrivate()
  const token = useStore((state) => state.auth.authenticationResult?.token)

  return useInfiniteQuery({
    queryKey: ['notifications', 'list'],
    queryFn: async ({ pageParam }): Promise<GetNotificationsResponse> => {
      const params = new URLSearchParams({
        page: String(pageParam),
        limit: String(NOTIFICATIONS_PAGE_SIZE),
      })
      const res = await axiosPrivate.get(`/notifications?${params.toString()}`)
      return res.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length + 1 : undefined),
    enabled: !!token,
  })
}

export default useGetNotifications
