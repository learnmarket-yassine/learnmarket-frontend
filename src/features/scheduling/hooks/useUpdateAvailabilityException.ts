import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateAvailabilityExceptionInput } from '../types/dto'
import { AxiosInstance } from 'axios'

const updateAvailabilityException = async (
  axiosPrivate: AxiosInstance,
  id: string,
  data: UpdateAvailabilityExceptionInput
) => {
  const response = await axiosPrivate.patch(`/tutor/availability/exceptions/${id}`, data)
  return response.data
}

export default function useUpdateAvailabilityException() {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAvailabilityExceptionInput }) =>
      updateAvailabilityException(axiosPrivate, id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['availabilityExceptions'] }),
  })
}
