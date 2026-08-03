import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { LearnRequest } from '../store/types'
import ToastMessage from '@/components/layout/ToastMessage'

const usePublishLearnRequest = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<LearnRequest> => {
      const response = await axiosPrivate.post(`/learn-requests/${id}/publish`)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['learnRequest', data.id] })
      queryClient.invalidateQueries({ queryKey: ['myLearnRequests'] })
      ToastMessage({ type: 'success', message: 'Learning request published.' })
    },
    onError: () => {
      ToastMessage({
        type: 'error',
        message: 'Failed to publish the learning request. Please try again.',
      })
    },
  })
}

export default usePublishLearnRequest
