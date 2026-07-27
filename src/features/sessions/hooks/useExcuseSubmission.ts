import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'

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
    },
  })

  return {
    handleExcuse: excuseMutation.mutateAsync,
    isPending: excuseMutation.isPending,
  }
}
