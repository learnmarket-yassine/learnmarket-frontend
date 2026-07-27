import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'

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
    },
  })

  return {
    handleDeleteComment: deleteMutation.mutate,
    isPending: deleteMutation.isPending,
  }
}
