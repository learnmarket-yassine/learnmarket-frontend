import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import ToastMessage from '@/components/layout/ToastMessage'

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
      ToastMessage({ type: 'success', message: 'Session confirmed.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to confirm the session. Please try again.' })
    },
  })

  return {
    handleConfirmSession: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
  }
}
