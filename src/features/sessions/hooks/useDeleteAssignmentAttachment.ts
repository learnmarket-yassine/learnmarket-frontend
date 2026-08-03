import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'

const deleteAssignmentAttachment = async (
  api: AxiosInstance,
  assignmentId: string,
  attachmentId: string
): Promise<void> => {
  await api.delete(`/assignments/${assignmentId}/attachments/${attachmentId}`)
}

export default function useDeleteAssignmentAttachment(sessionId: string, assignmentId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (attachmentId: string) =>
      deleteAssignmentAttachment(axiosPrivate, assignmentId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'assignment'] })
    },
  })

  return {
    handleDelete: deleteMutation.mutate,
    isPending: deleteMutation.isPending,
  }
}
