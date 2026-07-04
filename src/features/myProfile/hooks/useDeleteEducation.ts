import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

const deleteEducation = async (id: string, axiosPrivate: AxiosInstance) => {
  const response = await axiosPrivate.delete(`/tutor/education/${id}`)
  return response.data
}

const useDeleteEducation = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const deleteEducationMutation = useMutation({
    mutationFn: (id: string) => deleteEducation(id, axiosPrivate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
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
