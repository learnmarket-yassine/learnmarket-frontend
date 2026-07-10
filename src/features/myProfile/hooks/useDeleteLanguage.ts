import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

const deleteLanguage = async (id: string, axiosPrivate: AxiosInstance) => {
  const response = await axiosPrivate.delete(`/users/me/languages/${id}`)
  return response.data
}

const useDeleteLanguage = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const deleteLanguageMutation = useMutation({
    mutationFn: (id: string) => deleteLanguage(id, axiosPrivate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
    },
  })

  const handleDeleteLanguage = async (id: string) => {
    await deleteLanguageMutation.mutateAsync(id)
  }

  return {
    handleDeleteLanguage,
    isPending: deleteLanguageMutation.isPending,
  }
}

export default useDeleteLanguage
