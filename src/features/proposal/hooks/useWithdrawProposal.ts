import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import ToastMessage from '@/components/layout/ToastMessage'

const useWithdrawProposal = (proposalId: string) => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await axiosPrivate.post(`/proposals/${proposalId}/withdraw`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals', proposalId] })
      queryClient.invalidateQueries({ queryKey: ['proposals', 'mine'] })
      ToastMessage({ type: 'success', message: 'Proposal withdrawn.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to withdraw proposal. Please try again.' })
    },
  })
}

export default useWithdrawProposal
