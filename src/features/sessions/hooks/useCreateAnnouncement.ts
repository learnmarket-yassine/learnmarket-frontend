import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { Announcement } from '../../scheduling/types/dto'
import { uploadFileToStorage } from '../utils/uploadFile'
import ToastMessage from '@/components/layout/ToastMessage'

export interface CreateAnnouncementInput {
  content: string
  files?: File[]
}

async function createAnnouncement(
  api: AxiosInstance,
  sessionId: string,
  input: CreateAnnouncementInput
): Promise<Announcement> {
  const attachments = []
  for (const file of input.files ?? []) {
    const key = await uploadFileToStorage(api, file, 'announcement-attachment')
    attachments.push({ key, fileName: file.name, mimeType: file.type })
  }

  const { data } = await api.post(`/sessions/${sessionId}/announcements`, {
    content: input.content,
    attachments,
  })
  return data
}

export default function useCreateAnnouncement(sessionId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (input: CreateAnnouncementInput) =>
      createAnnouncement(axiosPrivate, sessionId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'announcements'] })
      ToastMessage({ type: 'success', message: 'Announcement posted.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to post announcement. Please try again.' })
    },
  })

  return {
    handleCreate: createMutation.mutateAsync,
    isPending: createMutation.isPending,
  }
}
