import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { SlotHold } from '../types/dto'

const releaseHold = async (api: AxiosInstance, holdId: string): Promise<SlotHold> => {
  const response = await api.post(`/holds/${holdId}/release`)
  return response.data
}

export function useReleaseHold() {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (holdId: string) => releaseHold(axiosPrivate, holdId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['proposal'] }),
  })
}
