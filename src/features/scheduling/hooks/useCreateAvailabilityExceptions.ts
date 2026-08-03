import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateAvailabilityExceptionInput } from '../types/dto'
import { AxiosInstance } from 'axios'
import ToastMessage from '@/components/layout/ToastMessage'

const createAvailabilityException = async (
  axiosPrivate: AxiosInstance,
  data: CreateAvailabilityExceptionInput
) => {
  const response = await axiosPrivate.post('/tutor/availability/exceptions', data)
  return response.data
}

export default function useCreateAvailabilityException() {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAvailabilityExceptionInput) =>
      createAvailabilityException(axiosPrivate, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availabilityExceptions'] })
      ToastMessage({ type: 'success', message: 'Availability exception created.' })
    },
    onError: () => {
      ToastMessage({
        type: 'error',
        message: 'Failed to create the availability exception. Please try again.',
      })
    },
  })
}
