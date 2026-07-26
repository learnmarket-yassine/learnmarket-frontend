import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'

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
    },
  })

  return {
    handleComplete: completeMutation.mutateAsync,
    isPending: completeMutation.isPending,
  }
}
