import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@/store/store'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Proposal } from '../types'

const useWithdrawProposal = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const authenticationResult = useStore((state) => state.auth.authenticationResult)

  return useMutation({
    mutationFn: async (proposalId: string): Promise<Proposal> => {
      const response = await axiosPrivate.patch(
        `/proposals/${proposalId}/withdraw`,
        {},
        { headers: { Authorization: `Bearer ${authenticationResult?.token}` } }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['MyProposals'] })
    },
  })
}

export default useWithdrawProposal
