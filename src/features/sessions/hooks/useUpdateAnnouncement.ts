import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { Announcement } from '../../scheduling/types/dto'

async function updateAnnouncement(
  api: AxiosInstance,
  announcementId: string,
  content: string
): Promise<Announcement> {
  const { data } = await api.patch(`/announcements/${announcementId}`, { content })
  return data
}

export default function useUpdateAnnouncement(sessionId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: ({ announcementId, content }: { announcementId: string; content: string }) =>
      updateAnnouncement(axiosPrivate, announcementId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'announcements'] })
    },
  })

  return {
    handleUpdate: updateMutation.mutateAsync,
    isPending: updateMutation.isPending,
  }
}
