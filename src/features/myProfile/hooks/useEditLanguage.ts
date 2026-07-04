import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@/store/store'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { AddLanguageFormData } from '../schemas'

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
      const response = await axiosPrivate.patch(`/tutor/languages/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${authenticationResult?.token}`,
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
    },
  })
}

export default useEditLanguage
