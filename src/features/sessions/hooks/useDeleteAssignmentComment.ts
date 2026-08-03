import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import ToastMessage from '@/components/layout/ToastMessage'

const deleteComment = async (api: AxiosInstance, commentId: string): Promise<void> => {
  await api.delete(`/assignments/comments/${commentId}`)
}

export default function useDeleteAssignmentComment(sessionId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(axiosPrivate, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'assignment'] })
      ToastMessage({ type: 'success', message: 'Comment deleted.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to delete comment. Please try again.' })
    },
  })

  return {
    handleDeleteComment: deleteMutation.mutate,
    isPending: deleteMutation.isPending,
  }
}
