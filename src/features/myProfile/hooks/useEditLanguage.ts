import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@/store/store'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { AddLanguageFormData } from '../schemas'
import ToastMessage from '@/components/layout/ToastMessage'

type EditLanguageVariables = {
  id: string
  payload: AddLanguageFormData
}

const useEditLanguage = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const authenticationResult = useStore((state) => state.auth.authenticationResult)
  return useMutation({
    mutationFn: async ({ payload, id }: EditLanguageVariables): Promise<AddLanguageFormData> => {
      const response = await axiosPrivate.patch(`/users/me/languages/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${authenticationResult?.token}`,
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
      ToastMessage({ type: 'success', message: 'Language updated.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to update language. Please try again.' })
    },
  })
}

export default useEditLanguage
