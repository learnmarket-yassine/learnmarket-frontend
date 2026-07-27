import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'

const joinSession = async (api: AxiosInstance, sessionId: string): Promise<{ joined: true }> => {
  const response = await api.post(`/sessions/${sessionId}/join`)
  return response.data
}

export default function useJoinSession(sessionId: string) {
  const axiosPrivate = useAxiosPrivate()

  const joinSessionMutation = useMutation({
    mutationFn: () => joinSession(axiosPrivate, sessionId),
  })

  return {
    handleJoinSession: joinSessionMutation.mutate,
    hasFired: joinSessionMutation.isSuccess || joinSessionMutation.isPending,
  }
}
