import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Specialty } from '@/types/category'
import ToastMessage from '@/components/layout/ToastMessage'

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
      ToastMessage({ type: 'success', message: 'Specialties updated.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to update specialties. Please try again.' })
    },
  })
}

export default useReplaceTutorSpecialties
