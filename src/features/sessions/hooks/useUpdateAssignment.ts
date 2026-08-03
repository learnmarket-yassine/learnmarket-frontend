import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { Assignment } from '../../scheduling/types/dto'
import { uploadFileToStorage } from '../utils/uploadFile'

export interface UpdateAssignmentInput {
  title?: string
  instructions?: string
  dueAt?: string
  files?: File[]
}

async function updateAssignment(
  api: AxiosInstance,
  sessionId: string,
  input: UpdateAssignmentInput
): Promise<Assignment> {
  const attachments = []
  for (const file of input.files ?? []) {
    const key = await uploadFileToStorage(api, file, 'assignment-attachment')
    attachments.push({ key, fileName: file.name, mimeType: file.type })
  }

  const { data } = await api.patch(`/sessions/${sessionId}/assignment`, {
    title: input.title,
    instructions: input.instructions,
    dueAt: input.dueAt,
    attachments,
  })
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
