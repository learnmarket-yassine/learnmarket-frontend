import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import type { AvailableSlotsQuery, AvailableSlotsResponse } from '../../types/dto'
import { AxiosInstance } from 'axios'

const getAvailableSlots = async (
  api: AxiosInstance,
  tutorId: string,
  query: AvailableSlotsQuery
): Promise<AvailableSlotsResponse> => {
  const response = await api.get(`/tutors/${tutorId}/available-slots`, {
    params: query,
  })
  return response.data
}
export function useAvailableSlots(tutorId: string | undefined, query: AvailableSlotsQuery) {
  const axiosPrivate = useAxiosPrivate()
  return useQuery({
    queryKey: ['availableSlots', tutorId, query],
    queryFn: () => getAvailableSlots(axiosPrivate, tutorId as string, query),
    enabled: Boolean(tutorId),
    refetchOnWindowFocus: true,
  })
}
