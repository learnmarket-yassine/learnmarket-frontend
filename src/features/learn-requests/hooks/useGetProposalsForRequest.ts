import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Proposal } from '@/features/proposal/store/types'

export const PROPOSALS_PAGE_SIZE = 5

interface GetProposalsForRequestResponse {
  paginatedResult: Proposal[]
  totalCount: number
}

function useGetProposalsForRequest(
  learnRequestId: string,
  page: number,
  search: string,
  take: number = PROPOSALS_PAGE_SIZE
) {
  const axiosPrivate = useAxiosPrivate()

  return useQuery({
    queryKey: ['learnRequest', learnRequestId, 'proposals', page, search, take],
    queryFn: async (): Promise<GetProposalsForRequestResponse> => {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      params.set('page', String(page))
      params.set('take', String(take))
      const response = await axiosPrivate.get(
        `/learn-requests/${learnRequestId}/proposals?${params.toString()}`
      )
      return response.data
    },
    enabled: !!learnRequestId,
    placeholderData: (previousData) => previousData,
  })
}

export default useGetProposalsForRequest
