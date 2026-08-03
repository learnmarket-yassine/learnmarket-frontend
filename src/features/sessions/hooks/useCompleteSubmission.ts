import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import ToastMessage from '@/components/layout/ToastMessage'

const completeSubmission = async (api: AxiosInstance, assignmentId: string): Promise<void> => {
  await api.post(`/assignments/${assignmentId}/submission/complete`)
}

export default function useCompleteSubmission(sessionId: string, assignmentId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const completeMutation = useMutation({
    mutationFn: () => completeSubmission(axiosPrivate, assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'assignment'] })
      ToastMessage({ type: 'success', message: 'Submission marked as complete.' })
    },
    onError: () => {
      ToastMessage({
        type: 'error',
        message: 'Failed to complete the submission. Please try again.',
      })
    },
  })

  return {
    handleComplete: completeMutation.mutateAsync,
    isPending: completeMutation.isPending,
  }
}
