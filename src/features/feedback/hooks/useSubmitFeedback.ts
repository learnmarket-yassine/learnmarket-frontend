import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Feedback, SubmitFeedbackInput } from '../store/types'

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
    },
  })

  return {
    handleSubmit: submitMutation.mutateAsync,
    isPending: submitMutation.isPending,
    error: submitMutation.error,
  }
}
