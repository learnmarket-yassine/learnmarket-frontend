import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

export default function useHireProposal(learnRequestId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (proposalId: string) => {
      const response = await axiosPrivate.post(`/proposals/${proposalId}/accept`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learnRequest', learnRequestId] })
    },
  })
}
