import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { AnnouncementComment } from '../../scheduling/types/dto'
import ToastMessage from '@/components/layout/ToastMessage'

async function createComment(
  api: AxiosInstance,
  announcementId: string,
  content: string
): Promise<AnnouncementComment> {
  const { data } = await api.post(`/announcements/${announcementId}/comments`, { content })
  return data
}

export default function useCreateAnnouncementComment(sessionId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const commentMutation = useMutation({
    mutationFn: ({ announcementId, content }: { announcementId: string; content: string }) =>
      createComment(axiosPrivate, announcementId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'announcements'] })
      ToastMessage({ type: 'success', message: 'Comment posted.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to post comment. Please try again.' })
    },
  })

  return {
    handleCreateComment: commentMutation.mutateAsync,
    isPending: commentMutation.isPending,
  }
}
