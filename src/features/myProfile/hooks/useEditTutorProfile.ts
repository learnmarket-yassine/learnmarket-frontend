import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@/store/store'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { TutorProfile } from '../store/types'
import ToastMessage from '@/components/layout/ToastMessage'

const useEditTutorProfile = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const authenticationResult = useStore((state) => state.auth.authenticationResult)
  return useMutation({
    mutationFn: async (payload: Partial<TutorProfile>): Promise<TutorProfile> => {
      const response = await axiosPrivate.patch(`/tutor/profile`, payload, {
        headers: {
          Authorization: `Bearer ${authenticationResult?.token}`,
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
      ToastMessage({ type: 'success', message: 'Tutor profile updated.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to update tutor profile. Please try again.' })
    },
  })
}

export default useEditTutorProfile
