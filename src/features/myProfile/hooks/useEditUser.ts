import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@/store/store'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { userToEdit } from '../types'

const useEditUserInfo = () => {
  const queryClient = useQueryClient()
  const userId = useStore((state) => state.auth.user?.id)
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
    mutationFn: async (payload: Partial<userToEdit>): Promise<userToEdit> => {
      const response = await axiosPrivate.patch(`/users/${userId}`, payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
    },
  })
}

export default useEditUserInfo
