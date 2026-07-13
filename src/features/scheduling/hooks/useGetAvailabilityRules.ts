import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { AvailabilityRule } from '../types/dto'

const listAvailabilityRules = async (axiosPrivate: AxiosInstance): Promise<AvailabilityRule[]> => {
  const response = await axiosPrivate.get('/tutor/availability/rules')
  return response.data
}

const useGetAvailabilityRules = () => {
  const axiosPrivate = useAxiosPrivate()
  return useQuery({
    queryKey: ['availabilityRules'],
    queryFn: () => listAvailabilityRules(axiosPrivate),
  })
}
export default useGetAvailabilityRules
