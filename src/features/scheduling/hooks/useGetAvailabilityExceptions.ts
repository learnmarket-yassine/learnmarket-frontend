import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { AvailabilityException } from '../types/dto'

const listAvailabilityExceptions = async (
  axiosPrivate: AxiosInstance
): Promise<AvailabilityException[]> => {
  const response = await axiosPrivate.get('/tutor/availability/exceptions')
  return response.data
}

export default function useAvailabilityExceptions() {
  const axiosPrivate = useAxiosPrivate()
  return useQuery({
    queryKey: ['availabilityExceptions'],
    queryFn: () => listAvailabilityExceptions(axiosPrivate),
  })
}
