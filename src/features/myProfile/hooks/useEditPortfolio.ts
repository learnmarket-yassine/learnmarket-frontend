import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { PortfolioFormValues } from '../schemas'
import { PortfolioItem } from '../store/types'

type EditPortfolioVariables = {
  id: string
  payload: Partial<PortfolioFormValues>
}

const useEditPortfolio = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
    mutationFn: async ({ id, payload }: EditPortfolioVariables): Promise<PortfolioItem> => {
      const response = await axiosPrivate.patch(`/tutor/portfolio/${id}`, payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
    },
  })
}

export default useEditPortfolio
