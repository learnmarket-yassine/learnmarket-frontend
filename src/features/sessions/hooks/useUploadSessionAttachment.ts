import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { SessionAttachment } from '../../scheduling/types/dto'

type PresignResponse = { key: string; uploadUrl: string; expiresIn: number }

async function uploadFile(api: AxiosInstance, file: File): Promise<string> {
  const { data: presign } = await api.post<PresignResponse>('/uploads/presign', {
    purpose: 'session-attachment',
    fileName: file.name,
    contentType: file.type,
  })

  const uploadResponse = await fetch(presign.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
  if (!uploadResponse.ok) {
    throw new Error('Failed to upload the file')
  }

  return presign.key
}

export default function useUploadSessionAttachment(sessionId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const uploadMutation = useMutation({
    mutationFn: async (file: File): Promise<SessionAttachment> => {
      const key = await uploadFile(axiosPrivate, file)
      const { data } = await axiosPrivate.post(`/sessions/${sessionId}/attachments`, {
        key,
        fileName: file.name,
        mimeType: file.type,
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'attachments'] })
    },
  })

  return {
    handleUpload: uploadMutation.mutateAsync,
    isPending: uploadMutation.isPending,
    isError: uploadMutation.isError,
  }
}
