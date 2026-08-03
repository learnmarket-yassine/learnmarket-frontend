import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import ToastMessage from '@/components/layout/ToastMessage'

const useDeleteLearnRequest = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await axiosPrivate.delete(`/learn-requests/${id}`)
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['learnRequest', id] })
      queryClient.invalidateQueries({ queryKey: ['myLearnRequests'] })
      ToastMessage({ type: 'success', message: 'Learning request deleted.' })
    },
    onError: () => {
      ToastMessage({
        type: 'error',
        message: 'Failed to delete the learning request. Please try again.',
      })
    },
  })
}

export default useDeleteLearnRequest
