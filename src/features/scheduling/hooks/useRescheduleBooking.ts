import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import ToastMessage from '@/components/layout/ToastMessage'

export function useRescheduleBooking(bookingId: string, sessionId: string, proposalId?: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.post(`/bookings/${bookingId}/reschedule`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'context'] })
      if (proposalId) {
        queryClient.invalidateQueries({ queryKey: ['proposal', proposalId] })
      }
      queryClient.invalidateQueries({ queryKey: ['myBookings'] })
      ToastMessage({ type: 'success', message: 'Your booking has been rescheduled.' })
    },
    onError: () => {
      ToastMessage({
        type: 'error',
        message: 'Failed to reschedule the booking. Please try again.',
      })
    },
  })
}
