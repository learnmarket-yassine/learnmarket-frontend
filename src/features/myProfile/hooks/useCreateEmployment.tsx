import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@/store/store'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { EmploymentFormData } from '../schemas'
import ToastMessage from '@/components/layout/ToastMessage'

const useCreateEmployment = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const authenticationResult = useStore((state) => state.auth.authenticationResult)
  return useMutation({
    mutationFn: async (payload: EmploymentFormData): Promise<EmploymentFormData> => {
      const response = await axiosPrivate.post(`/tutor/employment`, payload, {
        headers: {
          Authorization: `Bearer ${authenticationResult?.token}`,
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
      ToastMessage({ type: 'success', message: 'Employment entry added.' })
    },
    onError: () => {
      ToastMessage({
        type: 'error',
        message: 'Failed to add employment entry. Please try again.',
      })
    },
  })
}

export default useCreateEmployment
