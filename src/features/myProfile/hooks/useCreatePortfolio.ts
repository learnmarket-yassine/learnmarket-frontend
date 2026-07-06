import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { PortfolioFormValues } from '../schemas'
import { PortfolioItem } from '../store/types'

const useCreatePortfolio = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
    mutationFn: async (payload: PortfolioFormValues): Promise<PortfolioItem> => {
      const response = await axiosPrivate.post('/tutor/portfolio', payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
    },
  })
}

export default useCreatePortfolio
