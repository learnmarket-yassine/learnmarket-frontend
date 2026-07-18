import { useInfiniteQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { LearnRequest, LearnRequestStatus, LearnRequestType } from '../store/types'

export interface LearnRequestFilters {
  status?: LearnRequestStatus[]
  categoryId?: string
  type?: LearnRequestType
  search?: string
  actionNeeded?: boolean
}

interface GetLearnRequestsResponse {
  paginatedResult: LearnRequest[]
  totalCount: number
}

const TAKE = 6

const useGetLearnRequests = (filters: LearnRequestFilters, options?: { enabled?: boolean }) => {
  const axiosPrivate = useAxiosPrivate()

  return useInfiniteQuery({
    queryKey: ['learn-requests', filters],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams()
      if (filters.status?.length) params.set('status', filters.status.join(','))
      if (filters.categoryId) params.set('categoryId', filters.categoryId)
      if (filters.type) params.set('type', filters.type)
      if (filters.search) params.set('search', filters.search)
      if (filters.actionNeeded) params.set('actionNeeded', 'true')
      params.set('page', String(pageParam))
      params.set('take', String(TAKE))

      const res = await axiosPrivate.get(`/learn-requests?${params.toString()}`)
      return res.data as GetLearnRequestsResponse
    },
    initialPageParam: 0,
    enabled: options?.enabled !== false,
    getNextPageParam: (lastPage, allPages) =>
      allPages.length < Math.ceil(lastPage.totalCount / TAKE) ? allPages.length : undefined,
  })
}

export default useGetLearnRequests
