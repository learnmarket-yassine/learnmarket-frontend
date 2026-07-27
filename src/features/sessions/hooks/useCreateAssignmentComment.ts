import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { AssignmentComment } from '../../scheduling/types/dto'

async function createComment(
  api: AxiosInstance,
  assignmentId: string,
  content: string
): Promise<AssignmentComment> {
  const { data } = await api.post(`/assignments/${assignmentId}/comments`, { content })
  return data
}

export default function useCreateAssignmentComment(sessionId: string, assignmentId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const commentMutation = useMutation({
    mutationFn: (content: string) => createComment(axiosPrivate, assignmentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'assignment'] })
    },
  })

  return {
    handleCreateComment: commentMutation.mutateAsync,
    isPending: commentMutation.isPending,
  }
}
