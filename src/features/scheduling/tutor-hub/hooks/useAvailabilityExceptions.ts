import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { schedulingClient } from '../../api/schedulingClient'
import type {
  CreateAvailabilityExceptionInput,
  UpdateAvailabilityExceptionInput,
} from '../../types/dto'

const QUERY_KEY = ['availabilityExceptions']

export function useAvailabilityExceptions() {
  const axiosPrivate = useAxiosPrivate()
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => schedulingClient.listAvailabilityExceptions(axiosPrivate),
  })
}

export function useCreateAvailabilityException() {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAvailabilityExceptionInput) =>
      schedulingClient.createAvailabilityException(axiosPrivate, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdateAvailabilityException() {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAvailabilityExceptionInput }) =>
      schedulingClient.updateAvailabilityException(axiosPrivate, id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeleteAvailabilityException() {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => schedulingClient.deleteAvailabilityException(axiosPrivate, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
