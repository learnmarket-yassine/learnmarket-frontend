import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Feedback, SubmitFeedbackInput } from '../store/types'
import ToastMessage from '@/components/layout/ToastMessage'

export default function useSubmitFeedback(proposalId: string, aboutUserId?: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const submitMutation = useMutation({
    mutationFn: async (input: SubmitFeedbackInput): Promise<Feedback> => {
      const response = await axiosPrivate.post(`/proposals/${proposalId}/feedback`, input)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals', proposalId, 'feedback'] })
      if (aboutUserId) {
        queryClient.invalidateQueries({ queryKey: ['tutors', aboutUserId, 'rating'] })
      }
      ToastMessage({ type: 'success', message: 'Feedback submitted.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to submit feedback. Please try again.' })
    },
  })

  return {
    handleSubmit: submitMutation.mutateAsync,
    isPending: submitMutation.isPending,
    error: submitMutation.error,
  }
}
