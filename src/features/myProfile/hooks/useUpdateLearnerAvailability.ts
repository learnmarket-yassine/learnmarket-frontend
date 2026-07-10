import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { AvailabilitySlotValue } from '@/features/myProfile/store/types'

const useUpdateLearnerAvailability = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  return useMutation({
    mutationFn: async (slots: AvailabilitySlotValue[]) => {
      const response = await axiosPrivate.patch('/learner/profile/availability', { slots })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
    },
  })
}

export default useUpdateLearnerAvailability
