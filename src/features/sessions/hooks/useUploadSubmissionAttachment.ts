import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { SubmissionAttachment } from '../../scheduling/types/dto'

interface PresignResponse {
  key: string
  uploadUrl: string
  expiresIn: number
}

async function uploadSubmissionFile(
  api: AxiosInstance,
  assignmentId: string,
  file: File
): Promise<SubmissionAttachment> {
  const { data: presign } = await api.post<PresignResponse>(
    `/assignments/${assignmentId}/submission/attachments/presign`,
    { fileName: file.name, contentType: file.type }
  )

  const uploadResponse = await fetch(presign.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
  if (!uploadResponse.ok) {
    throw new Error('Failed to upload the file')
  }

  const { data } = await api.post(`/assignments/${assignmentId}/submission/attachments`, {
    key: presign.key,
    fileName: file.name,
    mimeType: file.type,
  })
  return data
}

export default function useUploadSubmissionAttachment(sessionId: string, assignmentId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadSubmissionFile(axiosPrivate, assignmentId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'assignment'] })
    },
  })

  return {
    handleUpload: uploadMutation.mutateAsync,
    isPending: uploadMutation.isPending,
  }
}
