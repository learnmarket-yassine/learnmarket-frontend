import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { Booking } from '../types/dto'

const cancelBooking = async (api: AxiosInstance, bookingId: string): Promise<Booking> => {
  const response = await api.patch(`/bookings/${bookingId}/cancel`)
  return response.data
}

export function useCancelBooking() {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: string) => cancelBooking(axiosPrivate, bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposal'] })
      queryClient.invalidateQueries({ queryKey: ['myBookings'] })
    },
  })

  return {
    handleCreateHold: cancelBookingMutation.mutateAsync,
    isPending: cancelBookingMutation.isPending,
  }
}
