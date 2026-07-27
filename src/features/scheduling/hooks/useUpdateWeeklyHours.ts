import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { AvailabilityRule } from '../types/dto'
import { WeeklyHoursMutations } from '../components/ui/weeklyHoursDiff'

const updateWeeklyHours = async (
  axiosPrivate: AxiosInstance,
  diff: WeeklyHoursMutations
): Promise<AvailabilityRule[]> => {
  const response = await axiosPrivate.put('/tutor/availability/rules', diff)
  return response.data
}

export default function useUpdateWeeklyHours() {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (diff: WeeklyHoursMutations) => updateWeeklyHours(axiosPrivate, diff),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['availabilityRules'] }),
  })
}
