import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { PortfolioFormValues } from '../schemas'
import { PortfolioItem } from '../store/types'
import { flattenSkills } from '../utils/normalizeSkills'
import ToastMessage from '@/components/layout/ToastMessage'

type EditPortfolioVariables = {
  id: string
  payload: Partial<PortfolioFormValues>
}

const useEditPortfolio = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
    mutationFn: async ({ id, payload }: EditPortfolioVariables): Promise<PortfolioItem> => {
      const { skills, ...rest } = payload
      const response = await axiosPrivate.patch(`/tutor/portfolio/${id}`, {
        ...rest,
        skillIds: skills?.map((skill) => skill.id),
      })
      return { ...response.data, skills: flattenSkills(response.data.skills) }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
      ToastMessage({ type: 'success', message: 'Portfolio item updated.' })
    },
    onError: () => {
      ToastMessage({
        type: 'error',
        message: 'Failed to update portfolio item. Please try again.',
      })
    },
  })
}

export default useEditPortfolio
