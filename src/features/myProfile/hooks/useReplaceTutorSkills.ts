import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Skill } from '@/types/skill'

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
    },
  })
}

export default useReplaceTutorSkills
