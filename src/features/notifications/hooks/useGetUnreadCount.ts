import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useStore } from '@/store/store'

const useGetUnreadCount = () => {
  const axiosPrivate = useAxiosPrivate()
  const token = useStore((state) => state.auth.authenticationResult?.token)

  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const res = await axiosPrivate.get<{ count: number }>('/notifications/unread-count')
      return res.data.count
    },
    enabled: !!token,
  })
}

export default useGetUnreadCount
