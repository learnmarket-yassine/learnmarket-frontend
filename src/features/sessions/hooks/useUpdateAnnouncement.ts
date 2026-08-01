import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { Announcement } from '../../scheduling/types/dto'
import { uploadFileToStorage } from '../utils/uploadFile'

export interface UpdateAnnouncementInput {
  announcementId: string
  content: string
  files?: File[]
}

async function updateAnnouncement(
  api: AxiosInstance,
  input: UpdateAnnouncementInput
): Promise<Announcement> {
  const attachments = []
  for (const file of input.files ?? []) {
    const key = await uploadFileToStorage(api, file, 'announcement-attachment')
    attachments.push({ key, fileName: file.name, mimeType: file.type })
  }

  const { data } = await api.patch(`/announcements/${input.announcementId}`, {
    content: input.content,
    attachments,
  })
  return data
}

export default function useUpdateAnnouncement(sessionId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: (input: UpdateAnnouncementInput) => updateAnnouncement(axiosPrivate, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'announcements'] })
    },
  })

  return {
    handleUpdate: updateMutation.mutateAsync,
    isPending: updateMutation.isPending,
  }
}
