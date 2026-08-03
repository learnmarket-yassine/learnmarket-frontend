import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { AvailabilitySlotValue } from '@/features/myProfile/store/types'
import ToastMessage from '@/components/layout/ToastMessage'

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
      ToastMessage({ type: 'success', message: 'Availability updated.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to update availability. Please try again.' })
    },
  })
}

export default useUpdateLearnerAvailability
