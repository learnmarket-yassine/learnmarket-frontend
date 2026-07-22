import SearchInput from '@/components/ui/SearchInput'
import useDebounce from '@/hooks/useDebounce'
import { useState } from 'react'
import useGetProposalsForRequest, {
  PROPOSALS_PAGE_SIZE,
} from '../../hooks/useGetProposalsForRequest'
import { LearnRequestStatus } from '../../store/types'
import LearnRequestProposalList from './LearnRequestProposalList'

type LearnRequestProposalStepProps = {
  learnRequestId: string
  status: LearnRequestStatus
}

const LearnRequestProposalStep = ({ learnRequestId, status }: LearnRequestProposalStepProps) => {
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput)
  const [page, setPage] = useState(0)

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    setPage(0)
  }

  const { data, isLoading, isError, refetch } = useGetProposalsForRequest(
    learnRequestId,
    page,
    debouncedSearch,
    PROPOSALS_PAGE_SIZE
  )
  const proposals = data?.paginatedResult ?? []
  const totalCount = data?.totalCount ?? 0

  return (
    <div className="flex flex-col space-y-8">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h4 className="cursor-pointer font-bold text-[#143681] underline decoration-[#143681]">
            All proposals
          </h4>
        </div>
        <SearchInput
          placeholder="search by tutor name"
          value={searchInput}
          onChange={handleSearchChange}
          onClear={() => handleSearchChange('')}
        />
      </div>
      <div className="flex-1">
        <LearnRequestProposalList
          proposals={proposals}
          learnRequestStatus={status}
          learnRequestId={learnRequestId}
          totalCount={totalCount}
          page={page}
          setPage={setPage}
          isLoading={isLoading}
          isError={isError}
          hasSearch={!!debouncedSearch}
          onRetry={() => refetch()}
        />
      </div>
    </div>
  )
}

export default LearnRequestProposalStep
