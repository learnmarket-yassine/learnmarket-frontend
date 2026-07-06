import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosInstance } from 'axios'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { ContentItem } from '@/components/ui/MediaBlock'
import { PortfolioMedia } from '../store/types'

type PresignResponse = {
  key: string
  uploadUrl: string
  expiresIn: number
}

type AddPortfolioMediaVariables = {
  itemId: string
  item: ContentItem
}

async function uploadFile(
  axiosPrivate: AxiosInstance,
  purpose: string,
  file: File
): Promise<string> {
  const { data: presign } = await axiosPrivate.post<PresignResponse>('/uploads/presign', {
    purpose,
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

const useAddPortfolioMedia = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  return useMutation({
    mutationFn: async ({ itemId, item }: AddPortfolioMediaVariables): Promise<PortfolioMedia> => {
      if (item.type === 'image') {
        const key = await uploadFile(axiosPrivate, 'portfolio-image', item.file!)
        const { data } = await axiosPrivate.post(`/tutor/portfolio/${itemId}/media`, {
          type: 'IMAGE',
          key,
        })
        return data
      }

      if (item.type === 'video') {
        if (item.file) {
          const key = await uploadFile(axiosPrivate, 'portfolio-video', item.file)
          const { data } = await axiosPrivate.post(`/tutor/portfolio/${itemId}/media`, {
            type: 'VIDEO_FILE',
            key,
          })
          return data
        }
        const { data } = await axiosPrivate.post(`/tutor/portfolio/${itemId}/media`, {
          type: 'VIDEO_LINK',
          url: item.url,
        })
        return data
      }

      const { data } = await axiosPrivate.post(`/tutor/portfolio/${itemId}/media`, {
        type: 'LINK',
        url: item.value,
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
    },
  })
}

export default useAddPortfolioMedia
