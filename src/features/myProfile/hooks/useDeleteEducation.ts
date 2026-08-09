import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import ToastMessage from '@/components/layout/ToastMessage'

const deleteEducation = async (id: string, axiosPrivate: AxiosInstance) => {
  const response = await axiosPrivate.delete(`/users/me/education/${id}`)
  return response.data
}

const useDeleteEducation = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const deleteEducationMutation = useMutation({
    mutationFn: (id: string) => deleteEducation(id, axiosPrivate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
      ToastMessage({ type: 'success', message: 'Education entry deleted.' })
    },
    onError: () => {
      ToastMessage({
        type: 'error',
        message: 'Failed to delete education entry. Please try again.',
      })
    },
  })

  const handleDeleteEducation = async (id: string) => {
    await deleteEducationMutation.mutateAsync(id)
  }

  return {
    handleDeleteEducation,
    isPending: deleteEducationMutation.isPending,
  }
}

export default useDeleteEducation
