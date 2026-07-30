import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { FeedbackEntry } from '../store/types'

const useGetProposalFeedback = (proposalId: string | undefined) => {
  const axiosPrivate = useAxiosPrivate()

  return useQuery({
    queryKey: ['proposals', proposalId, 'feedback'],
    queryFn: async (): Promise<FeedbackEntry[]> => {
      const response = await axiosPrivate.get(`/proposals/${proposalId}/feedback`)
      return response.data
    },
    enabled: !!proposalId,
  })
}

export default useGetProposalFeedback
