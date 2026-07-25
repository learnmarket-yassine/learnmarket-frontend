import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Booking } from '../../types/dto'
import { AxiosInstance } from 'axios'

const cancelBooking = async (api: AxiosInstance, bookingId: string): Promise<Booking> => {
  const response = await api.patch(`/bookings/${bookingId}/cancel`)
  return response.data
}

export function useCancelBooking() {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: string) => cancelBooking(axiosPrivate, bookingId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['proposal'] }),
  })

  return {
    handleCreateHold: cancelBookingMutation.mutateAsync,
    isPending: cancelBookingMutation.isPending,
  }
}
