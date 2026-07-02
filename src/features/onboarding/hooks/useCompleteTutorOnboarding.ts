import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { TutorOnboardingFormData } from '../schemas'

const useCompleteTutorOnboarding = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: TutorOnboardingFormData) => {
      const response = await axiosPrivate.patch('/tutor-profile/onboarding', data)
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
      navigate('/profile', { replace: true })
    },
  })
}

export default useCompleteTutorOnboarding
