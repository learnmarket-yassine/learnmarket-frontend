import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import ToastMessage from '@/components/layout/ToastMessage'

const deleteCertification = async (id: string, axiosPrivate: AxiosInstance) => {
  const response = await axiosPrivate.delete(`/tutor/certifications/${id}`)
  return response.data
}

const useDeleteCertification = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const deleteCertificationMutation = useMutation({
    mutationFn: (id: string) => deleteCertification(id, axiosPrivate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
      ToastMessage({ type: 'success', message: 'Certification deleted.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to delete certification. Please try again.' })
    },
  })

  const handleDeleteCertification = async (id: string) => {
    await deleteCertificationMutation.mutateAsync(id)
  }

  return {
    handleDeleteCertification,
    isPending: deleteCertificationMutation.isPending,
  }
}

export default useDeleteCertification
