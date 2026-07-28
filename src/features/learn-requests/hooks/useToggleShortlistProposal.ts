import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

interface GetProposalsForRequestResponse {
  paginatedResult: { id: string; isShortlisted?: boolean }[]
  totalCount: number
}

function updateIsShortlistedInList<T extends GetProposalsForRequestResponse>(
  data: T | undefined,
  proposalId: string,
  isShortlisted: boolean
): T | undefined {
  if (!data) return data
  return {
    ...data,
    paginatedResult: data.paginatedResult.map((item) =>
      item.id === proposalId ? { ...item, isShortlisted } : item
    ),
  }
}

function useToggleShortlistProposal(learnRequestId: string, proposalId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const queryKeyPrefix = ['learnRequest', learnRequestId, 'proposals']

  return useMutation({
    mutationFn: (isShortlisted: boolean) =>
      isShortlisted
        ? axiosPrivate.delete(`/proposals/${proposalId}/shortlist`)
        : axiosPrivate.post(`/proposals/${proposalId}/shortlist`),
    onMutate: async (isShortlisted) => {
      await queryClient.cancelQueries({ queryKey: queryKeyPrefix })
      const previous = queryClient.getQueriesData<GetProposalsForRequestResponse>({
        queryKey: queryKeyPrefix,
      })
      queryClient.setQueriesData<GetProposalsForRequestResponse>(
        { queryKey: queryKeyPrefix },
        (old) => updateIsShortlistedInList(old, proposalId, !isShortlisted)
      )
      return { previous }
    },
    onError: (_err, _isShortlisted, context) => {
      context?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data))
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeyPrefix }),
  })
}

export default useToggleShortlistProposal
