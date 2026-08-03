import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { CertificationFile } from '../store/types'
import ToastMessage from '@/components/layout/ToastMessage'

interface PresignResponse {
  key: string
  uploadUrl: string
  expiresIn: number
}

export async function uploadCertificationFile(
  api: AxiosInstance,
  certId: string,
  file: File
): Promise<CertificationFile> {
  const { data: presign } = await api.post<PresignResponse>('/uploads/presign', {
    purpose: 'certification-file',
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

  const { data } = await api.post(`/tutor/certifications/${certId}/files`, {
    key: presign.key,
    fileName: file.name,
    mimeType: file.type,
  })
  return data
}

const useUploadCertificationFile = (certId: string) => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadCertificationFile(axiosPrivate, certId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
      ToastMessage({ type: 'success', message: 'File uploaded.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to upload file. Please try again.' })
    },
  })

  return {
    handleUpload: uploadMutation.mutateAsync,
    isPending: uploadMutation.isPending,
  }
}

export default useUploadCertificationFile
