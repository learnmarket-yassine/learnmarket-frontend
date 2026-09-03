import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { ProposalFormValues } from '../schemas'
import { AxiosInstance } from 'axios'
import { isInsufficientSparksError } from '@/features/sparks/utils/errors'
import { useState } from 'react'
import ToastMessage from '@/components/layout/ToastMessage'
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()
  const createProposalMutation = useMutation({
    mutationFn: async ({ learnRequestId, payload }: CreateProposalPayload) =>
      createProposal(axiosPrivate, learnRequestId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learn-requests'] })
      ToastMessage({ type: 'success', message: 'Proposal submitted.' })
      navigate('/accueil')
    },
    onError: (error) => {
      if (isInsufficientSparksError(error)) {
        setInsufficientSparksState(true)
      } else {
        ToastMessage({ type: 'error', message: 'Failed to submit proposal. Please try again.' })
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
