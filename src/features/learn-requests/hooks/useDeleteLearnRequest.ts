import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

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
    },
  })
}

export default useDeleteLearnRequest
