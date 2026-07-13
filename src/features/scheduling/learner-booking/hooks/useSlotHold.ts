import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { schedulingClient } from '../../api/schedulingClient'
import type { CreateHoldInput } from '../../types/dto'

export function useCreateHold() {
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
    mutationFn: (input: CreateHoldInput) => schedulingClient.createHold(axiosPrivate, input),
  })
}

export function useConfirmHold() {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (holdId: string) => schedulingClient.confirmHold(axiosPrivate, holdId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['proposal'] }),
  })
}

export function useReleaseHold() {
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
    mutationFn: (holdId: string) => schedulingClient.releaseHold(axiosPrivate, holdId),
  })
}
