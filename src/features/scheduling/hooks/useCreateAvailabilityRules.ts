import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { CreateAvailabilityRuleInput } from '../types/dto'

const createAvailabilityRules = async (
  axiosPrivate: AxiosInstance,
  data: CreateAvailabilityRuleInput
) => {
  const response = await axiosPrivate.post('/tutor/availability/rules', data)
  return response.data
}

export default function useCreateAvailabilityRule() {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAvailabilityRuleInput) =>
      createAvailabilityRules(axiosPrivate, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['availabilityRules'] }),
  })
}
