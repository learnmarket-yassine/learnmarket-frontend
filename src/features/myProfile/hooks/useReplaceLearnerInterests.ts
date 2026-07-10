import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Specialty } from '@/types/category'

const useReplaceLearnerInterests = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  return useMutation({
    mutationFn: async (interests: Specialty[]) => {
      const response = await axiosPrivate.put('/learner/interests', {
        specialtyIds: interests.map((interest) => interest.id),
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
    },
  })
}

export default useReplaceLearnerInterests
