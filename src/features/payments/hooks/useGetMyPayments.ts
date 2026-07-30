import { useInfiniteQuery } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useStore } from '@/store/store'
import { GetMyPaymentsResponse } from '../store/types'

export const MY_PAYMENTS_PAGE_SIZE = 5
export const MY_PAYMENTS_FILTER_TYPE = 'payments'

const getMyPayments = async (
  axiosPrivate: AxiosInstance,
  page: number,
  take: number,
  sortDir: 'asc' | 'desc' | undefined,
  status: string | undefined
): Promise<GetMyPaymentsResponse> => {
  const params = new URLSearchParams({ page: String(page), take: String(take) })
  if (sortDir) params.set('sortDir', sortDir)
  if (status) params.set('status', status)
  const response = await axiosPrivate.get(`/payments/mine?${params.toString()}`)
  return response.data
}

const useGetMyPayments = (take = MY_PAYMENTS_PAGE_SIZE) => {
  const axiosPrivate = useAxiosPrivate()
  const filters = useStore((state) => state.tableFilters.filters)[MY_PAYMENTS_FILTER_TYPE]

  const sortDir = filters.find(
    (filter) => filter.optionName === 'date' && filter.filterKey === 'order'
  )?.filterValue as 'asc' | 'desc' | undefined
  const status = filters.find(
    (filter) => filter.optionName === 'status' && filter.filterKey === 'radio'
  )?.filterValue

  return useInfiniteQuery({
    queryKey: ['payments', 'mine', take, sortDir, status],
    queryFn: ({ pageParam }) => getMyPayments(axiosPrivate, pageParam, take, sortDir, status),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      pages.length * take < lastPage.totalCount ? pages.length : undefined,
    placeholderData: (previousData) => previousData,
  })
}

export default useGetMyPayments
