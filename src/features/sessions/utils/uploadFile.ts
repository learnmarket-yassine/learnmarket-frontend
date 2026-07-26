import { AxiosInstance } from 'axios'

interface PresignResponse {
  key: string
  uploadUrl: string
  expiresIn: number
}

export async function uploadFileToStorage(
  api: AxiosInstance,
  file: File,
  purpose: string
): Promise<string> {
  const { data: presign } = await api.post<PresignResponse>('/uploads/presign', {
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
