import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'

const disputeSession = async (
  api: AxiosInstance,
  sessionId: string,
  reason: string
): Promise<void> => {
  await api.post(`/sessions/${sessionId}/dispute`, { reason })
}

export default function useDisputeSession(sessionId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (reason: string) => disputeSession(axiosPrivate, sessionId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'context'] })
    },
  })

  return {
    handleDisputeSession: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
  }
}
