import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { Assignment } from '../../scheduling/types/dto'
import { uploadFileToStorage } from '../utils/uploadFile'
import ToastMessage from '@/components/layout/ToastMessage'

export interface CreateAssignmentInput {
  title: string
  instructions?: string
  dueAt?: string
  files?: File[]
}

async function createAssignment(
  api: AxiosInstance,
  sessionId: string,
  input: CreateAssignmentInput
): Promise<Assignment> {
  const attachments = []
  for (const file of input.files ?? []) {
    const key = await uploadFileToStorage(api, file, 'assignment-attachment')
    attachments.push({ key, fileName: file.name, mimeType: file.type })
  }

  const { data } = await api.post(`/sessions/${sessionId}/assignment`, {
    title: input.title,
    instructions: input.instructions,
    dueAt: input.dueAt,
    attachments,
  })
  return data
}

export default function useCreateAssignment(sessionId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (input: CreateAssignmentInput) => createAssignment(axiosPrivate, sessionId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'assignment'] })
      ToastMessage({ type: 'success', message: 'Assignment created.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to create assignment. Please try again.' })
    },
  })

  return {
    handleCreate: createMutation.mutateAsync,
    isPending: createMutation.isPending,
  }
}
