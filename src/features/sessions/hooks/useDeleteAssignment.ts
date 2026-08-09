import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import ToastMessage from '@/components/layout/ToastMessage'

const deleteAssignment = async (api: AxiosInstance, sessionId: string): Promise<void> => {
  await api.delete(`/sessions/${sessionId}/assignment`)
}

export default function useDeleteAssignment(sessionId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: () => deleteAssignment(axiosPrivate, sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'assignment'] })
      ToastMessage({ type: 'success', message: 'Assignment deleted.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to delete assignment. Please try again.' })
    },
  })

  return {
    handleDelete: deleteMutation.mutate,
    isPending: deleteMutation.isPending,
  }
}
