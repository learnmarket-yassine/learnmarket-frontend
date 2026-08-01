import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { SessionAttachment } from '../../scheduling/types/dto'

const listAttachments = async (
  api: AxiosInstance,
  sessionId: string
): Promise<SessionAttachment[]> => {
  const response = await api.get(`/sessions/${sessionId}/attachments`)
  return response.data
}

export default function useSessionAttachments(sessionId: string) {
  const axiosPrivate = useAxiosPrivate()

  return useQuery({
    queryKey: ['session', sessionId, 'attachments'],
    queryFn: () => listAttachments(axiosPrivate, sessionId),
    enabled: !!sessionId,
  })
}
