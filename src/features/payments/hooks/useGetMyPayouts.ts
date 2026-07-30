import { useInfiniteQuery } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useStore } from '@/store/store'
import { GetMyPayoutsResponse } from '../store/types'

export const MY_PAYOUTS_PAGE_SIZE = 10
export const MY_PAYOUTS_FILTER_TYPE = 'payouts'

const getMyPayouts = async (
  axiosPrivate: AxiosInstance,
  page: number,
  take: number,
  sortDir: 'asc' | 'desc' | undefined,
  status: string | undefined
): Promise<GetMyPayoutsResponse> => {
  const params = new URLSearchParams({ page: String(page), take: String(take) })
  if (sortDir) params.set('sortDir', sortDir)
  if (status) params.set('status', status)
  const response = await axiosPrivate.get(`/payouts/mine?${params.toString()}`)
  return response.data
}

const useGetMyPayouts = (take = MY_PAYOUTS_PAGE_SIZE) => {
  const axiosPrivate = useAxiosPrivate()
  const filters = useStore((state) => state.tableFilters.filters)[MY_PAYOUTS_FILTER_TYPE]

  const sortDir = filters.find(
    (filter) => filter.optionName === 'date' && filter.filterKey === 'order'
  )?.filterValue as 'asc' | 'desc' | undefined
  const status = filters.find(
    (filter) => filter.optionName === 'status' && filter.filterKey === 'radio'
  )?.filterValue

  return useInfiniteQuery({
    queryKey: ['payouts', 'mine', take, sortDir, status],
    queryFn: ({ pageParam }) => getMyPayouts(axiosPrivate, pageParam, take, sortDir, status),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      pages.length * take < lastPage.totalCount ? pages.length : undefined,
    placeholderData: (previousData) => previousData,
  })
}

export default useGetMyPayouts
