import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { ProposalFormValues } from '../schemas'
import { AxiosInstance } from 'axios'
import { isInsufficientSparksError } from '@/features/sparks/utils/errors'
import { useState } from 'react'

type CreateProposalPayload = {
  learnRequestId: string
  payload: ProposalFormValues
}

const createProposal = async (
  axiosPrivate: AxiosInstance,
  learnRequestId: string,
  payload: ProposalFormValues
) => {
  const response = await axiosPrivate.post(`learn-requests/${learnRequestId}/proposals`, payload)
  return response.data
}

export default function useCreateProposal() {
  const [InsufficientSparksState, setInsufficientSparksState] = useState(false)
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const createProposalMutation = useMutation({
    mutationFn: async ({ learnRequestId, payload }: CreateProposalPayload) =>
      createProposal(axiosPrivate, learnRequestId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learn-requests'] })
    },
    onError: (error) => {
      if (isInsufficientSparksError(error)) {
        setInsufficientSparksState(true)
      }
    },
  })

  const handleCreateProposal = async ({ learnRequestId, payload }: CreateProposalPayload) => {
    await createProposalMutation.mutateAsync({
      learnRequestId,
      payload,
    })
  }

  return {
    handleCreateProposal,
    isPending: createProposalMutation.isPending,
    insufficientSparksState: InsufficientSparksState,
    setInsufficientSparksState,
  }
}
