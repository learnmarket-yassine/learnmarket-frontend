import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import ToastMessage from '@/components/layout/ToastMessage'

const deleteEmployment = async (id: string, axiosPrivate: AxiosInstance) => {
  const response = await axiosPrivate.delete(`/tutor/employment/${id}`)
  return response.data
}

const useDeleteEmployment = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const deleteEmploymentMutation = useMutation({
    mutationFn: (id: string) => deleteEmployment(id, axiosPrivate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
      ToastMessage({ type: 'success', message: 'Employment entry deleted.' })
    },
    onError: () => {
      ToastMessage({
        type: 'error',
        message: 'Failed to delete employment entry. Please try again.',
      })
    },
  })

  const handleDeleteEmployment = async (id: string) => {
    await deleteEmploymentMutation.mutateAsync(id)
  }

  return {
    handleDeleteEmployment,
    isPending: deleteEmploymentMutation.isPending,
  }
}

export default useDeleteEmployment
