import { useInfiniteQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import {
  LearnRequest,
  LearnRequestStatus,
  LearnRequestType,
  ProficiencyLevel,
} from '../store/types'

export interface LearnRequestFilters {
  status?: LearnRequestStatus[]
  categoryId?: string
  type?: LearnRequestType[]
  search?: string
  actionNeeded?: boolean
  level?: ProficiencyLevel[]
  budgetMin?: number
  budgetMax?: number
  preferredLanguages?: string[]
  requestedFrequency?: number[]
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
      if (filters.type?.length) params.set('type', filters.type.join(','))
      if (filters.search) params.set('search', filters.search)
      if (filters.actionNeeded) params.set('actionNeeded', 'true')
      if (filters.level?.length) params.set('level', filters.level.join(','))
      if (filters.budgetMin !== undefined) params.set('budgetMin', String(filters.budgetMin))
      if (filters.budgetMax !== undefined) params.set('budgetMax', String(filters.budgetMax))
      if (filters.preferredLanguages?.length) {
        params.set('preferredLanguages', filters.preferredLanguages.join(','))
      }
      if (filters.requestedFrequency?.length) {
        params.set('requestedFrequency', filters.requestedFrequency.join(','))
      }
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
