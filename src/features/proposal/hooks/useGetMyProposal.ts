import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { MyProposalDetail } from '../store/types'

const useGetMyProposal = (proposalId?: string) => {
  const axiosPrivate = useAxiosPrivate()

  return useQuery({
    queryKey: ['proposals', proposalId],
    queryFn: async (): Promise<MyProposalDetail> => {
      const res = await axiosPrivate.get(`/proposals/${proposalId}`)
      return res.data as MyProposalDetail
    },
    enabled: !!proposalId,
  })
}

export default useGetMyProposal
