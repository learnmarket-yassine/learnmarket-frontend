import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@/store/store'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { EmploymentFormData } from '../schemas'
import ToastMessage from '@/components/layout/ToastMessage'

type EditEmploymentnVariables = {
  id: string
  payload: Partial<EmploymentFormData>
}

const useEditEmployment = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const authenticationResult = useStore((state) => state.auth.authenticationResult)
  return useMutation({
    mutationFn: async ({
      payload,
      id,
    }: EditEmploymentnVariables): Promise<EditEmploymentnVariables> => {
      const response = await axiosPrivate.patch(`/tutor/employment/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${authenticationResult?.token}`,
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
      ToastMessage({ type: 'success', message: 'Employment entry updated.' })
    },
    onError: () => {
      ToastMessage({
        type: 'error',
        message: 'Failed to update employment entry. Please try again.',
      })
    },
  })
}

export default useEditEmployment
