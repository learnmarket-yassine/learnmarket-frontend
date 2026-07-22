import { useQuery } from '@tanstack/react-query'
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

export interface GetLearnRequestsResponse {
  paginatedResult: LearnRequest[]
  totalCount: number
}

export const LEARN_REQUESTS_PAGE_SIZE = 10

const useGetLearnRequests = (
  filters: LearnRequestFilters,
  page: number,
  take: number,
  options?: { enabled?: boolean }
) => {
  const axiosPrivate = useAxiosPrivate()

  return useQuery({
    queryKey: ['learn-requests', filters, page, take],
    queryFn: async (): Promise<GetLearnRequestsResponse> => {
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
      params.set('page', String(page))
      params.set('take', String(take))

      const res = await axiosPrivate.get(`/learn-requests?${params.toString()}`)
      return res.data as GetLearnRequestsResponse
    },
    enabled: options?.enabled !== false,
    placeholderData: (previousData) => previousData,
  })
}

export default useGetLearnRequests
