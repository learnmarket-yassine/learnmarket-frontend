import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateHoldInput, SlotHold } from '../../types/dto'
import { AxiosInstance } from 'axios'

const createHold = async (api: AxiosInstance, input: CreateHoldInput): Promise<SlotHold> => {
  const response = await api.post('/holds', input)
  return response.data
}

export function useCreateHold() {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const createHoldMutation = useMutation({
    mutationFn: (input: CreateHoldInput) => createHold(axiosPrivate, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['proposal'] }),
  })

  return {
    handleCreateHold: createHoldMutation.mutateAsync,
    isPending: createHoldMutation.isPending,
  }
}
