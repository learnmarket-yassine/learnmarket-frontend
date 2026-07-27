import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { MyBooking } from '../types/dto'

interface GetMyBookingsParams {
  from?: string
  to?: string
}

const listMyBookings = async (
  axiosPrivate: AxiosInstance,
  params: GetMyBookingsParams
): Promise<MyBooking[]> => {
  const response = await axiosPrivate.get('/bookings/mine', { params })
  return response.data
}

export default function useGetMyBookings(params: GetMyBookingsParams = {}) {
  const axiosPrivate = useAxiosPrivate()
  return useQuery({
    queryKey: ['myBookings', params.from, params.to],
    queryFn: () => listMyBookings(axiosPrivate, params),
  })
}
