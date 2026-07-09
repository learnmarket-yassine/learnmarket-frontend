import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Specialty } from '@/types/category'

const useReplaceTutorSpecialties = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  return useMutation({
    mutationFn: async (specialties: Specialty[]) => {
      const response = await axiosPrivate.put('/tutor/specialties', {
        specialtyIds: specialties.map((specialty) => specialty.id),
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
    },
  })
}

export default useReplaceTutorSpecialties
