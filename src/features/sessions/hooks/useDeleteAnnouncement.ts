import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import ToastMessage from '@/components/layout/ToastMessage'

const deleteAnnouncement = async (api: AxiosInstance, announcementId: string): Promise<void> => {
  await api.delete(`/announcements/${announcementId}`)
}

export default function useDeleteAnnouncement(sessionId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (announcementId: string) => deleteAnnouncement(axiosPrivate, announcementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'announcements'] })
      ToastMessage({ type: 'success', message: 'Announcement deleted.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to delete announcement. Please try again.' })
    },
  })

  return {
    handleDelete: deleteMutation.mutate,
    isPending: deleteMutation.isPending,
  }
}
