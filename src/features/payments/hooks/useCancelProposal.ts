import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import ToastMessage from '@/components/layout/ToastMessage'

export default function useCancelProposal(learnRequestId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ proposalId, reason }: { proposalId: string; reason?: string }) => {
      await axiosPrivate.post(`/proposals/${proposalId}/cancel`, { reason })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learnRequest', learnRequestId] })
      ToastMessage({ type: 'success', message: 'Engagement cancelled.' })
    },
    onError: () => {
      ToastMessage({
        type: 'error',
        message: 'Failed to cancel the engagement. Please try again.',
      })
    },
  })
}
