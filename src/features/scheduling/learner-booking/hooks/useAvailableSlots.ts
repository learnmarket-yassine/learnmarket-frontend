import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { schedulingClient } from '../../api/schedulingClient'
import type { AvailableSlotsQuery } from '../../types/dto'

/** Polls modestly + refetches on window focus so slots taken mid-browse surface without a manual refresh. */
export function useAvailableSlots(tutorId: string | undefined, query: AvailableSlotsQuery) {
  const axiosPrivate = useAxiosPrivate()
  return useQuery({
    queryKey: ['availableSlots', tutorId, query],
    queryFn: () => schedulingClient.getAvailableSlots(axiosPrivate, tutorId as string, query),
    enabled: Boolean(tutorId),
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
  })
}
