import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { userToEdit } from '../types'
import ToastMessage from '@/components/layout/ToastMessage'

const useEditUserInfo = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
    mutationFn: async (payload: Partial<userToEdit>): Promise<userToEdit> => {
      const response = await axiosPrivate.patch(`/users/me`, payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
      ToastMessage({ type: 'success', message: 'Profile updated.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to update profile. Please try again.' })
    },
  })
}

export default useEditUserInfo
