import { useQuery, keepPreviousData } from '@tanstack/react-query'
import useAxiosPrivate from './useAxiosPrivate'
import useDebounce from './useDebounce'
import { Skill } from '@/types/skill'

const MIN_QUERY_LENGTH = 1

const useSkillSearch = (query: string) => {
  const axiosPrivate = useAxiosPrivate()
  const debouncedQuery = useDebounce(query.trim(), 2000)

  const { data, isLoading, isFetching, error } = useQuery<Skill[]>({
    queryKey: ['skills', 'search', debouncedQuery],
    queryFn: async ({ signal }) => {
      const response = await axiosPrivate.get<Skill[]>('/skills', {
        params: { search: debouncedQuery },
        signal,
      })
      return response.data
    },
    enabled: debouncedQuery.length >= MIN_QUERY_LENGTH,
    placeholderData: keepPreviousData,
    staleTime: 30_000, // repeated searches for the same term within 30s skip the network entirely
  })

  return {
    results: data ?? [],
    isLoading: isLoading && debouncedQuery.length >= MIN_QUERY_LENGTH,
    isFetching,
    error: error ? 'Failed to search skills. Please try again.' : null,
  }
}

export default useSkillSearch
