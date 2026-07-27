import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { Assignment } from '../../scheduling/types/dto'

export interface UpdateAssignmentInput {
  title?: string
  instructions?: string
  dueAt?: string
}

async function updateAssignment(
  api: AxiosInstance,
  sessionId: string,
  input: UpdateAssignmentInput
): Promise<Assignment> {
  const { data } = await api.patch(`/sessions/${sessionId}/assignment`, input)
  return data
}

export default function useUpdateAssignment(sessionId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: (input: UpdateAssignmentInput) => updateAssignment(axiosPrivate, sessionId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'assignment'] })
    },
  })

  return {
    handleUpdate: updateMutation.mutateAsync,
    isPending: updateMutation.isPending,
  }
}
