import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { UpdateAvailabilityRuleInput } from '../types/dto'

const updateAvailabilityRule = async (
  axiosPrivate: AxiosInstance,
  id: string,
  data: UpdateAvailabilityRuleInput
) => {
  const response = await axiosPrivate.patch(`/tutor/availability/rules/${id}`, data)
  return response.data
}

export default function useUpdateAvailabilityRule() {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAvailabilityRuleInput }) =>
      updateAvailabilityRule(axiosPrivate, id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['availabilityRules'] }),
  })
}
