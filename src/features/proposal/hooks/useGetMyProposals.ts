import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { MyProposal, ProposalGroup } from '../store/types'
import { AxiosInstance } from 'axios'

export interface GetMyProposalsResponse {
  paginatedResult: MyProposal[]
  totalCount: number
}

export const MY_PROPOSALS_PAGE_SIZE = 10

const getMyProposals = async (
  axiosPrivate: AxiosInstance,
  params: URLSearchParams
): Promise<GetMyProposalsResponse> => {
  const response = await axiosPrivate.get(`/proposals/mine?${params.toString()}`)
  return response.data
}

const useGetMyProposals = (group: ProposalGroup, page: number, take = MY_PROPOSALS_PAGE_SIZE) => {
  const axiosPrivate = useAxiosPrivate()
  const params = new URLSearchParams({ group, page: String(page), take: String(take) })
  return useQuery({
    queryKey: ['proposals', 'mine', group, page, take],
    queryFn: async () => getMyProposals(axiosPrivate, params),
    placeholderData: (previousData) => previousData,
  })
}

export default useGetMyProposals
