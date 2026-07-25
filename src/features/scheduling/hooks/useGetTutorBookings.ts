import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { TutorBooking } from '../types/dto'

const listTutorBookings = async (axiosPrivate: AxiosInstance): Promise<TutorBooking[]> => {
  const response = await axiosPrivate.get('/bookings/mine')
  return response.data
}

export default function useGetTutorBookings() {
  const axiosPrivate = useAxiosPrivate()
  return useQuery({
    queryKey: ['tutorBookings'],
    queryFn: () => listTutorBookings(axiosPrivate),
  })
}
