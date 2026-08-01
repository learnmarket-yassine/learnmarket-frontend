import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'

const getAttachmentUrl = async (
  api: AxiosInstance,
  sessionId: string,
  attachmentId: string
): Promise<{ url: string; expiresIn: number }> => {
  const response = await api.get(`/sessions/${sessionId}/attachments/${attachmentId}/url`)
  return response.data
}

export default function useDownloadSessionAttachment(sessionId: string) {
  const axiosPrivate = useAxiosPrivate()

  const downloadMutation = useMutation({
    mutationFn: (attachmentId: string) => getAttachmentUrl(axiosPrivate, sessionId, attachmentId),
  })

  const handleDownload = async (attachmentId: string) => {
    const { url } = await downloadMutation.mutateAsync(attachmentId)
    window.open(url, '_blank')
  }

  return { handleDownload, isPending: downloadMutation.isPending }
}
