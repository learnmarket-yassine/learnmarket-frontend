import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { GetLearnRequestsResponse } from './useGetLearnRequests'

const useGetSavedLearnRequests = (page: number, take: number, options?: { enabled?: boolean }) => {
  const axiosPrivate = useAxiosPrivate()

  return useQuery({
    queryKey: ['learn-requests', 'saved', page, take],
    queryFn: async (): Promise<GetLearnRequestsResponse> => {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('take', String(take))
      const res = await axiosPrivate.get(`/learn-requests/saved?${params.toString()}`)
      return res.data as GetLearnRequestsResponse
    },
    enabled: options?.enabled !== false,
    placeholderData: (previousData) => previousData,
  })
}

export default useGetSavedLearnRequests
