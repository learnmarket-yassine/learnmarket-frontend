import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import ToastMessage from '@/components/layout/ToastMessage'

type PresignResponse = {
  key: string
  uploadUrl: string
  expiresIn: number
}

const useUploadAvatar = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const { data: presign } = await axiosPrivate.post<PresignResponse>('/uploads/presign', {
        purpose: 'avatar',
        fileName: file.name,
        contentType: file.type,
      })

      const uploadResponse = await fetch(presign.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload the image')
      }

      const { data } = await axiosPrivate.patch('/users/me/avatar', { key: presign.key })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
      ToastMessage({ type: 'success', message: 'Profile photo updated.' })
    },
    onError: () => {
      ToastMessage({
        type: 'error',
        message: 'Failed to update your profile photo. Please try again.',
      })
    },
  })
}

export default useUploadAvatar
