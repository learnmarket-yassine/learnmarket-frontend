import { useState } from 'react'
import { useStore } from '@/store/store'
import { Button } from '@/components/ui/button'
import SearchInput from '@/components/ui/SearchInput'
import FiltersModal from '@/features/Accueil/components/ui/FiltersModal'
import TutorLearningRequestCard from '@/features/Accueil/components/ui/TutorLearningRequestCard'
import useGetLearnRequests from '@/features/learn-requests/hooks/useGetLearnRequests'
import { LearnRequestFiltersValues } from '@/features/learn-requests/schemas'
import TutorAccueilRightBar from '@/features/Accueil/components/layout/TutorAccueilRightBar'

const TutorAccueilPage = () => {
  const user = useStore((state) => state.auth.user)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<LearnRequestFiltersValues>({})

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetLearnRequests({
    ...filters,
    search: search || undefined,
  })
  const learnRequests = data?.pages.flatMap((page) => page.paginatedResult) ?? []

  return (
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
          placeholder="search for learing requests"
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h4 className="cursor-pointer font-bold underline">Best matches</h4>
            <h4 className="cursor-pointer font-medium hover:font-bold">Saved jobs</h4>
          </div>
          <FiltersModal value={filters} onApply={setFilters} />
        </div>

        <div className="space-y-4">
          {learnRequests.map((learnRequest) => (
            <TutorLearningRequestCard key={learnRequest.id} {...learnRequest} />
          ))}
          {!isLoading && learnRequests.length === 0 && (
            <p className="text-sm text-[#6B7280]">No learning requests match your filters.</p>
          )}
        </div>

        {hasNextPage && (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="rounded-full px-6"
            >
              {isFetchingNextPage ? 'Loading...' : 'Load more'}
            </Button>
          </div>
        )}
      </div>
      <TutorAccueilRightBar user={user} />
    </div>
  )
}

export default TutorAccueilPage
