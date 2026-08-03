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

type ProposalTab = 'all' | 'shortlisted'

const TABS: { key: ProposalTab; label: string }[] = [
  { key: 'all', label: 'All proposals' },
  { key: 'shortlisted', label: 'Shortlisted' },
]

const LearnRequestProposalStep = ({ learnRequestId, status }: LearnRequestProposalStepProps) => {
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput)
  const [page, setPage] = useState(0)
  const [activeTab, setActiveTab] = useState<ProposalTab>('all')

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
  const displayedProposals =
    activeTab === 'shortlisted' ? proposals.filter((p) => p.isShortlisted) : proposals
  const totalCount =
    activeTab === 'shortlisted' ? displayedProposals.length : (data?.totalCount ?? 0)

  return (
    <div className="flex flex-col space-y-8">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {TABS.map((tab) => (
            <h4
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`cursor-pointer font-bold ${
                activeTab === tab.key
                  ? 'text-[#143681] underline decoration-[#143681]'
                  : 'text-[#565A60]'
              }`}
            >
              {tab.label}
            </h4>
          ))}
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
          proposals={displayedProposals}
          learnRequestStatus={status}
          learnRequestId={learnRequestId}
          totalCount={totalCount}
          page={page}
          setPage={setPage}
          isLoading={isLoading}
          isError={isError}
          hasSearch={!!debouncedSearch}
          onRetry={() => refetch()}
          emptyMessage={
            activeTab === 'shortlisted' ? "You haven't shortlisted any proposals yet" : undefined
          }
        />
      </div>
    </div>
  )
}

export default LearnRequestProposalStep
