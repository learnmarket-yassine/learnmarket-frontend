import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@/store/store'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Proposal } from '../types'

const useSubmitProposal = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const authenticationResult = useStore((state) => state.auth.authenticationResult)

  return useMutation({
    mutationFn: async ({
      annonceId,
      message,
    }: {
      annonceId: string
      message?: string
    }): Promise<Proposal> => {
      const response = await axiosPrivate.post(
        `/annonces/${annonceId}/proposals`,
        { message },
        { headers: { Authorization: `Bearer ${authenticationResult?.token}` } }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ConnectsBalance'] })
      queryClient.invalidateQueries({ queryKey: ['ConnectsTransactions'] })
      queryClient.invalidateQueries({ queryKey: ['MyProposals'] })
    },
  })
}

export default useSubmitProposal
