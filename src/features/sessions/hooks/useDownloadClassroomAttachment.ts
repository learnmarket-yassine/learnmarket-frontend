import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'

const getAttachmentUrl = async (
  api: AxiosInstance,
  path: string
): Promise<{ url: string; expiresIn: number }> => {
  const response = await api.get(path)
  return response.data
}

export default function useDownloadClassroomAttachment() {
  const axiosPrivate = useAxiosPrivate()

  const downloadMutation = useMutation({
    mutationFn: (path: string) => getAttachmentUrl(axiosPrivate, path),
  })

  const handleDownload = async (path: string) => {
    const { url } = await downloadMutation.mutateAsync(path)
    window.open(url, '_blank')
  }

  return { handleDownload, isPending: downloadMutation.isPending }
}
