import { useInfiniteQuery } from '@tanstack/react-query'
import useAxiosPrivate from './useAxiosPrivate'
import { Specialty, PaginatedResult } from '@/types/category'

const LIMIT = 10

const useSpecialtiesByCategory = (categoryId: string | null) => {
  const axiosPrivate = useAxiosPrivate()

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } =
    useInfiniteQuery({
      queryKey: ['specialties', categoryId],
      queryFn: async ({ pageParam, signal }) => {
        const response = await axiosPrivate.get<PaginatedResult<Specialty>>(
          `/categories/${categoryId}/specialties`,
          { params: { page: pageParam, limit: LIMIT }, signal }
        )
        return response.data
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
      enabled: !!categoryId,
      staleTime: 60 * 1000,
    })

  return {
    specialties: data?.pages.flatMap((page) => page.data) ?? [],
    isLoading,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    fetchNextPage,
    error: error ? 'Failed to load specialties. Please try again.' : null,
  }
}

export default useSpecialtiesByCategory
