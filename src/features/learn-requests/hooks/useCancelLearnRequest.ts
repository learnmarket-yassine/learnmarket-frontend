import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { LearnRequest } from '../store/types'

const useCancelLearnRequest = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<LearnRequest> => {
      const response = await axiosPrivate.post(`/learn-requests/${id}/cancel`)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['learnRequest', data.id] })
      queryClient.invalidateQueries({ queryKey: ['myLearnRequests'] })
    },
  })
}

export default useCancelLearnRequest
