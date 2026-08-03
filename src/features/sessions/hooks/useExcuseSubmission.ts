import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import ToastMessage from '@/components/layout/ToastMessage'

const excuseSubmission = async (api: AxiosInstance, assignmentId: string): Promise<void> => {
  await api.post(`/assignments/${assignmentId}/submission/excuse`)
}

export default function useExcuseSubmission(sessionId: string, assignmentId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const excuseMutation = useMutation({
    mutationFn: () => excuseSubmission(axiosPrivate, assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'assignment'] })
      ToastMessage({ type: 'success', message: 'Submission excused.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to excuse the submission. Please try again.' })
    },
  })

  return {
    handleExcuse: excuseMutation.mutateAsync,
    isPending: excuseMutation.isPending,
  }
}
