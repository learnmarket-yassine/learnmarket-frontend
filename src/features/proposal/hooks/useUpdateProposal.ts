import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { ProposalFormValues } from '../schemas'
import { AxiosInstance } from 'axios'

type UpdateProposalPayload = {
  proposalId: string
  payload: ProposalFormValues
}

const updateProposal = async (
  axiosPrivate: AxiosInstance,
  proposalId: string,
  payload: ProposalFormValues
) => {
  const response = await axiosPrivate.patch(`proposals/${proposalId}`, payload)
  return response.data
}

export default function useUpdateProposal() {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const updateProposalMutation = useMutation({
    mutationFn: async ({ proposalId, payload }: UpdateProposalPayload) =>
      updateProposal(axiosPrivate, proposalId, payload),
    onSuccess: (_data, { proposalId }) => {
      queryClient.invalidateQueries({ queryKey: ['proposals', proposalId] })
      queryClient.invalidateQueries({ queryKey: ['proposals', 'mine'] })
    },
  })

  const handleUpdateProposal = async ({ proposalId, payload }: UpdateProposalPayload) => {
    await updateProposalMutation.mutateAsync({
      proposalId,
      payload,
    })
  }

  return {
    handleUpdateProposal,
    isPending: updateProposalMutation.isPending,
  }
}
