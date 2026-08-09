import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import ToastMessage from '@/components/layout/ToastMessage'

const deleteAnnouncementAttachment = async (
  api: AxiosInstance,
  announcementId: string,
  attachmentId: string
): Promise<void> => {
  await api.delete(`/announcements/${announcementId}/attachments/${attachmentId}`)
}

export default function useDeleteAnnouncementAttachment(sessionId: string, announcementId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (attachmentId: string) =>
      deleteAnnouncementAttachment(axiosPrivate, announcementId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'announcements'] })
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
