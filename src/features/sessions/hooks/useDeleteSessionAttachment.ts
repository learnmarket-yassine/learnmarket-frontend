import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'

const deleteAttachment = async (
  api: AxiosInstance,
  sessionId: string,
  attachmentId: string
): Promise<void> => {
  await api.delete(`/sessions/${sessionId}/attachments/${attachmentId}`)
}

export default function useDeleteSessionAttachment(sessionId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (attachmentId: string) => deleteAttachment(axiosPrivate, sessionId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'attachments'] })
    },
  })

  return {
    handleDelete: deleteMutation.mutate,
    isPending: deleteMutation.isPending,
  }
}
