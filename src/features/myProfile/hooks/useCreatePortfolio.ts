import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { PortfolioFormValues } from '../schemas'
import { PortfolioItem } from '../store/types'
import { flattenSkills } from '../utils/normalizeSkills'
import ToastMessage from '@/components/layout/ToastMessage'

const useCreatePortfolio = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
    mutationFn: async (payload: PortfolioFormValues): Promise<PortfolioItem> => {
      const { skills, ...rest } = payload
      const response = await axiosPrivate.post('/tutor/portfolio', {
        ...rest,
        skillIds: skills.map((skill) => skill.id),
      })
      return { ...response.data, skills: flattenSkills(response.data.skills) }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
      ToastMessage({ type: 'success', message: 'Portfolio item added.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to add portfolio item. Please try again.' })
    },
  })
}

export default useCreatePortfolio
