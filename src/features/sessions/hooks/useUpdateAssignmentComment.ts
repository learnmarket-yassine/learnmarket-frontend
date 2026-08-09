import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { AssignmentComment } from '../../scheduling/types/dto'
import ToastMessage from '@/components/layout/ToastMessage'

async function updateComment(
  api: AxiosInstance,
  commentId: string,
  content: string
): Promise<AssignmentComment> {
  const { data } = await api.patch(`/assignments/comments/${commentId}`, { content })
  return data
}

export default function useUpdateAssignmentComment(sessionId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      updateComment(axiosPrivate, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'assignment'] })
      ToastMessage({ type: 'success', message: 'Comment updated.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to update comment. Please try again.' })
    },
  })

  return {
    handleUpdateComment: updateMutation.mutateAsync,
    isPending: updateMutation.isPending,
  }
}
