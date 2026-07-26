import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { Proposal } from '../types/dto'

const getProposal = async (api: AxiosInstance, id: string): Promise<Proposal> => {
  const response = await api.get(`/proposals/${id}`)
  return response.data
}

export function useGetProposal(proposalId: string) {
  const axiosPrivate = useAxiosPrivate()
  return useQuery({
    queryKey: ['proposal', proposalId],
    queryFn: () => getProposal(axiosPrivate, proposalId),
  })
}
