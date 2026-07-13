import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'

const deleteAvailabilityException = async (axiosPrivate: AxiosInstance, id: string) => {
  const response = await axiosPrivate.delete(`/tutor/availability/exceptions/${id}`)
  return response.data
}

export default function useDeleteAvailabilityException() {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const deleteAvailabilityExceptionMutation = useMutation({
    mutationFn: (id: string) => deleteAvailabilityException(axiosPrivate, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['availabilityExceptions'] }),
  })
  const handleDeleteAvailabilityException = async (id: string) => {
    await deleteAvailabilityExceptionMutation.mutateAsync(id)
  }
  return {
    handleDeleteAvailabilityException,
    isPending: deleteAvailabilityExceptionMutation.isPending,
  }
}
