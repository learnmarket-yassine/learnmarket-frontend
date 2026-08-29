import { useState } from 'react'
import { ProposalSessionPlan } from '../../store/types'
import ProposalSessionCard from './ProposalSessionCard'
import LearnRequestPagination from '@/features/learn-requests/components/ui/LearnRequestPagination'

const SESSIONS_PAGE_SIZE = 3

type ProposalSessionsSectionProps = {
  sessions?: ProposalSessionPlan[]
  sessionDurationMinutes?: number
}

function formatDurationMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}min`
}

const ProposalSessionsSection: React.FC<ProposalSessionsSectionProps> = ({
  sessions,
  sessionDurationMinutes,
}) => {
  const [page, setPage] = useState(0)
  const [openId, setOpenId] = useState<string | null>(null)

  const list = sessions ?? []

  if (list.length === 0) {
    return (
      <div className="space-y-2">
        <p className="text-lg font-bold text-[#1E293B]">Sessions plan</p>
        <p className="text-sm text-[#6B7280]">No session plan available.</p>
      </div>
    )
  }

  const totalPages = Math.max(1, Math.ceil(list.length / SESSIONS_PAGE_SIZE))
  const currentPage = Math.min(page, totalPages - 1)
  const pageItems = list.slice(
    currentPage * SESSIONS_PAGE_SIZE,
    currentPage * SESSIONS_PAGE_SIZE + SESSIONS_PAGE_SIZE
  )

  const durationLabel =
    sessionDurationMinutes !== undefined ? formatDurationMinutes(sessionDurationMinutes) : null
  const totalDurationLabel =
    sessionDurationMinutes !== undefined
      ? formatDurationMinutes(sessionDurationMinutes * list.length)
      : null

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    setOpenId(null)
  }

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-lg font-bold text-[#1E293B]">Sessions plan</p>
        <p className="text-sm font-medium text-[#6B7280]">
          {list.length} session{list.length > 1 ? 's' : ''}
          {totalDurationLabel ? ` · ${totalDurationLabel} total` : ''}
        </p>
      </div>
      <div className="space-y-2">
        {pageItems.map((session, pageIndex) => {
          const index = currentPage * SESSIONS_PAGE_SIZE + pageIndex
          return (
            <ProposalSessionCard
              key={session.id}
              position={index + 1}
              session={session}
              durationLabel={durationLabel}
              isOpen={session.id === openId}
              onToggle={() => handleToggle(session.id)}
            />
          )
        })}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-end">
          <LearnRequestPagination
            currentPage={currentPage}
            totalCount={list.length}
            take={SESSIONS_PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}

export default ProposalSessionsSection
