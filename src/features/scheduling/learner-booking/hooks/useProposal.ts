import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { schedulingClient } from '../../api/schedulingClient'

export function useProposal(proposalId: string) {
  const axiosPrivate = useAxiosPrivate()
  return useQuery({
    queryKey: ['proposal', proposalId],
    queryFn: () => schedulingClient.getProposal(axiosPrivate, proposalId),
  })
}
