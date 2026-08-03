import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Skill } from '@/types/skill'
import ToastMessage from '@/components/layout/ToastMessage'

const useReplaceTutorSkills = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  return useMutation({
    mutationFn: async (skills: Skill[]) => {
      const response = await axiosPrivate.put('/tutor/skills', {
        skillIds: skills.map((skill) => skill.id),
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
      ToastMessage({ type: 'success', message: 'Skills updated.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to update skills. Please try again.' })
    },
  })
}

export default useReplaceTutorSkills
