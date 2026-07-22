import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useStore } from '@/store/store'
import SearchInput from '@/components/ui/SearchInput'
import FiltersModal from '@/features/Accueil/components/ui/FiltersModal'
import useGetLearnRequests, {
  LEARN_REQUESTS_PAGE_SIZE,
} from '@/features/learn-requests/hooks/useGetLearnRequests'
import { LearnRequestFiltersValues } from '@/features/learn-requests/schemas'
import TutorAccueilRightBar from '@/features/Accueil/components/layout/TutorAccueilRightBar'
import LearnRequestPagination from '@/features/learn-requests/components/ui/LearnRequestPagination'
import useDebounce from '@/hooks/useDebounce'
import useGetProposals from '@/features/proposal/hooks/useGetProposals'
import TutorLearningRequestList from '@/features/Accueil/components/ui/TutorLearningRequestList'
import {
  buildLearnRequestFeedParams,
  LearnRequestFeedParams,
  parseLearnRequestFeedParams,
} from '@/features/learn-requests/utils/learnRequestFeedParams'

const TutorAccueilPage = () => {
  const user = useStore((state) => state.auth.user)

  // Search is deliberately local-only: typing never touches the URL, so it
  // resets on refresh -- only filters and page persist there.
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput)

  const [searchParams, setSearchParams] = useSearchParams()
  const searchParamsKey = searchParams.toString()
  // Keyed on the string, not the searchParams object, so `filters`/`page`
  // keep a stable identity across renders where the URL hasn't actually
  // changed -- FiltersModal's own effect depends on `value` by reference,
  // and an unstable filters object would re-clobber its draft every render.
  const { filters, page } = useMemo(
    () => parseLearnRequestFeedParams(new URLSearchParams(searchParamsKey)),
    [searchParamsKey]
  )

  const updateFeedParams = useCallback(
    (patch: Partial<LearnRequestFeedParams>, options?: { replace?: boolean }) => {
      setSearchParams(buildLearnRequestFeedParams({ filters, page, ...patch }), {
        replace: options?.replace ?? false,
      })
    },
    [filters, page, setSearchParams]
  )

  // Filter changes replace the current history entry -- tweaking filters
  // shouldn't spam the back button with one stop per Apply.
  const handleFiltersApply = useCallback(
    (nextFilters: LearnRequestFiltersValues) => {
      updateFeedParams({ filters: nextFilters, page: 0 }, { replace: true })
    },
    [updateFeedParams]
  )

  // Pagination pushes a new entry -- back button steps through pages.
  const setPage = useCallback(
    (nextPage: number) => updateFeedParams({ page: nextPage }, { replace: false }),
    [updateFeedParams]
  )

  const { data, isPlaceholderData, isLoading, isError } = useGetLearnRequests(
    { ...filters, search: debouncedSearch || undefined },
    page,
    LEARN_REQUESTS_PAGE_SIZE
  )
  const learnRequests = data?.paginatedResult ?? []
  const totalCount = data?.totalCount ?? 0

  const { data: myProposals } = useGetProposals()

  return (
    <>
      <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[1fr_350px]">
        <div className="space-y-8">
          <div className="relative overflow-hidden rounded-2xl bg-[#143681] px-8 py-10 text-white">
            <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/5" />
            <div className="relative flex flex-col space-y-6">
              <span className="text-lg font-medium text-white/70">
                Welcome back{user ? `, ${user.firstname}` : ''}
              </span>
              <h1 className="text-3xl font-bold leading-tight">
                Find students looking for a tutor like you.
              </h1>
              <p className="text-white/80">
                Browse learning requests that match your expertise, and send proposals to students
                ready to start.
              </p>
            </div>
          </div>
          <SearchInput
            placeholder="search for learning requests"
            value={searchInput}
            onChange={setSearchInput}
            onClear={() => setSearchInput('')}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h4 className="cursor-pointer font-bold underline">Best matches</h4>
              <h4 className="cursor-pointer font-medium hover:font-bold">Saved jobs</h4>
            </div>
            <FiltersModal value={filters} onApply={handleFiltersApply} />
          </div>
          <TutorLearningRequestList
            learnRequests={learnRequests}
            isPlaceholderData={isPlaceholderData}
            isError={isError}
            isLoading={isLoading}
          />
          <div className="flex items-center justify-end">
            <LearnRequestPagination
              currentPage={page}
              totalCount={totalCount}
              take={LEARN_REQUESTS_PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>
        </div>
        <TutorAccueilRightBar user={user} proposalsCount={myProposals?.length ?? 0} />
      </div>
    </>
  )
}

export default TutorAccueilPage
