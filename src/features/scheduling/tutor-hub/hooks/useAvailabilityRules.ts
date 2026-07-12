import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { schedulingClient } from '../../api/schedulingClient'
import type { CreateAvailabilityRuleInput, UpdateAvailabilityRuleInput } from '../../types/dto'

const QUERY_KEY = ['availabilityRules']

export function useAvailabilityRules() {
  const axiosPrivate = useAxiosPrivate()
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => schedulingClient.listAvailabilityRules(axiosPrivate),
  })
}

export function useCreateAvailabilityRule() {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAvailabilityRuleInput) =>
      schedulingClient.createAvailabilityRule(axiosPrivate, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdateAvailabilityRule() {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAvailabilityRuleInput }) =>
      schedulingClient.updateAvailabilityRule(axiosPrivate, id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeleteAvailabilityRule() {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => schedulingClient.deleteAvailabilityRule(axiosPrivate, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
