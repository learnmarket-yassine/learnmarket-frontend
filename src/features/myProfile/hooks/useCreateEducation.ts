import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@/store/store'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { EducationFormData } from '../schemas'
import ToastMessage from '@/components/layout/ToastMessage'

const useCreateEducation = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const authenticationResult = useStore((state) => state.auth.authenticationResult)
  return useMutation({
    mutationFn: async (payload: EducationFormData): Promise<EducationFormData> => {
      const response = await axiosPrivate.post(`/users/me/education`, payload, {
        headers: {
          Authorization: `Bearer ${authenticationResult?.token}`,
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
      ToastMessage({ type: 'success', message: 'Education entry added.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to add education entry. Please try again.' })
    },
  })
}

export default useCreateEducation
