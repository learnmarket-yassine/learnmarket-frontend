import { useInfiniteQuery } from '@tanstack/react-query'
import useAxiosPrivate from './useAxiosPrivate'
import { Category, PaginatedResult } from '@/types/category'

const LIMIT = 10

const useCategories = () => {
  const axiosPrivate = useAxiosPrivate()

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } =
    useInfiniteQuery({
      queryKey: ['categories'],
      queryFn: async ({ pageParam, signal }) => {
        const response = await axiosPrivate.get<PaginatedResult<Category>>('/categories', {
          params: { page: pageParam, take: LIMIT },
          signal,
        })
        return response.data
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
      staleTime: 5 * 60 * 1000,
    })

  return {
    categories: data?.pages.flatMap((page) => page.data) ?? [],
    isLoading,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    fetchNextPage,
    error: error ? 'Failed to load categories. Please try again.' : null,
  }
}

export default useCategories
