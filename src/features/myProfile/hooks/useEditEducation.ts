import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@/store/store'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { EducationFormData } from '../schemas'

type EditEducationVariables = {
  id: string
  payload: Partial<EducationFormData>
}

const useEditEducation = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const authenticationResult = useStore((state) => state.auth.authenticationResult)
  return useMutation({
    mutationFn: async ({
      payload,
      id,
    }: EditEducationVariables): Promise<EditEducationVariables> => {
      const response = await axiosPrivate.patch(`/users/me/education/${id}`, payload, {
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

export default useEditEducation
