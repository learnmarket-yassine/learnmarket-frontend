import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { PortfolioFormValues } from '../schemas'
import { PortfolioItem } from '../store/types'
import { flattenSkills } from '../utils/normalizeSkills'

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
    },
  })
}

export default useCreatePortfolio
