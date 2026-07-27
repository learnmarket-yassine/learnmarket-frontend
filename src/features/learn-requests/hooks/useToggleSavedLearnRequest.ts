import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { GetLearnRequestsResponse } from './useGetLearnRequests'

function updateIsSavedInList(
  data: GetLearnRequestsResponse | undefined,
  learnRequestId: string,
  isSavedByMe: boolean
): GetLearnRequestsResponse | undefined {
  if (!data) return data
  return {
    ...data,
    paginatedResult: data.paginatedResult.map((item) =>
      item.id === learnRequestId ? { ...item, isSavedByMe } : item
    ),
  }
}

function useToggleSavedLearnRequest(learnRequestId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (isSaved: boolean) =>
      isSaved
        ? axiosPrivate.delete(`/learn-requests/${learnRequestId}/save`)
        : axiosPrivate.post(`/learn-requests/${learnRequestId}/save`),
    onMutate: async (isSaved) => {
      await queryClient.cancelQueries({ queryKey: ['learn-requests'] })
      const previous = queryClient.getQueriesData<GetLearnRequestsResponse>({
        queryKey: ['learn-requests'],
      })
      queryClient.setQueriesData<GetLearnRequestsResponse>(
        { queryKey: ['learn-requests'] },
        (old) => updateIsSavedInList(old, learnRequestId, !isSaved)
      )
      return { previous }
    },
    onError: (_err, _isSaved, context) => {
      context?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data))
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['learn-requests'] }),
  })
}

export default useToggleSavedLearnRequest
