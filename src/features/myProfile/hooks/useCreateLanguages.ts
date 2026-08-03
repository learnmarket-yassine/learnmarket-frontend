import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@/store/store'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { AddLanguageFormData } from '../schemas'
import ToastMessage from '@/components/layout/ToastMessage'

const useCreateLanguage = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const authenticationResult = useStore((state) => state.auth.authenticationResult)
  return useMutation({
    mutationFn: async (payload: AddLanguageFormData): Promise<AddLanguageFormData> => {
      const response = await axiosPrivate.post(`/users/me/languages`, payload, {
        headers: {
          Authorization: `Bearer ${authenticationResult?.token}`,
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
      ToastMessage({ type: 'success', message: 'Language added.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to add language. Please try again.' })
    },
  })
}

export default useCreateLanguage
