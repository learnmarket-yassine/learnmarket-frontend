import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import ToastMessage from '@/components/layout/ToastMessage'

const deleteSubmissionAttachment = async (
  api: AxiosInstance,
  assignmentId: string,
  attachmentId: string
): Promise<void> => {
  await api.delete(`/assignments/${assignmentId}/submission/attachments/${attachmentId}`)
}

export default function useDeleteSubmissionAttachment(sessionId: string, assignmentId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (attachmentId: string) =>
      deleteSubmissionAttachment(axiosPrivate, assignmentId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'assignment'] })
      ToastMessage({ type: 'success', message: 'Attachment deleted.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to delete attachment. Please try again.' })
    },
  })

  return {
    handleDelete: deleteMutation.mutate,
    isPending: deleteMutation.isPending,
  }
}
