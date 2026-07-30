import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useInfiniteQuery } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { useStore } from '@/store/store'
import { GetSparksHistoryResponse } from '../store/types'

export const SPARKS_HISTORY_PAGE_SIZE = 10
export const SPARKS_HISTORY_FILTER_TYPE = 'sparks'

const getSparksHistory = async (
  api: AxiosInstance,
  page: number,
  take: number,
  sortDir: 'asc' | 'desc' | undefined
): Promise<GetSparksHistoryResponse> => {
  const params = new URLSearchParams({ page: String(page), take: String(take) })
  if (sortDir) params.set('sortDir', sortDir)
  const response = await api.get(`/sparks/history?${params.toString()}`)
  return response.data
}

export default function useGetSparksHistory(take = SPARKS_HISTORY_PAGE_SIZE) {
  const axiosPrivate = useAxiosPrivate()
  const filters = useStore((state) => state.tableFilters.filters)[SPARKS_HISTORY_FILTER_TYPE]

  const sortDir = filters.find(
    (filter) => filter.optionName === 'date' && filter.filterKey === 'order'
  )?.filterValue as 'asc' | 'desc' | undefined

  return useInfiniteQuery({
    queryKey: ['sparks', 'history', take, sortDir],
    queryFn: ({ pageParam }) => getSparksHistory(axiosPrivate, pageParam, take, sortDir),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      pages.length * take < lastPage.totalCount ? pages.length : undefined,
    placeholderData: (previousData) => previousData,
  })
}
