import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'

const confirmSession = async (api: AxiosInstance, sessionId: string): Promise<void> => {
  await api.post(`/sessions/${sessionId}/confirm`)
}

export default function useConfirmSession(sessionId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => confirmSession(axiosPrivate, sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'context'] })
    },
  })

  return {
    handleConfirmSession: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
  }
}
