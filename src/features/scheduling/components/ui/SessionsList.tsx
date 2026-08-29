import { useState } from 'react'
import LearnRequestPagination from '@/features/learn-requests/components/ui/LearnRequestPagination'
import { Proposal, Session } from '../../types/dto'
import { SESSIONS_PER_PAGE, findFirstActionablePageIndex } from '../../utils/sessionBoard'
import SessionBoardHeader from './SessionBoardHeader'
import SessionBoardRow from './SessionBoardRow'

type SessionsListProps = {
  sessions: Session[]
  proposal: Proposal
  canSchedule?: boolean
}

const SessionsList = ({ sessions, proposal, canSchedule = true }: SessionsListProps) => {
  const [page, setPage] = useState(() => findFirstActionablePageIndex(sessions, SESSIONS_PER_PAGE))
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const total = sessions.length
  const planTitle = proposal.learnRequest?.title ?? 'Session plan'

  if (total === 0) {
    return (
      <div className="space-y-2 bg-white p-6">
        <h2 className="text-lg font-bold text-[#1E293B]">{planTitle}</h2>
        <p className="text-sm text-[#6B7280]">No sessions yet.</p>
      </div>
    )
  }

  const totalPages = Math.max(1, Math.ceil(total / SESSIONS_PER_PAGE))
  const currentPage = Math.min(page, totalPages - 1)
  const start = currentPage * SESSIONS_PER_PAGE
  const pageItems = sessions.slice(start, start + SESSIONS_PER_PAGE)

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    setExpandedId(null)
  }

  const handleToggleObjective = (sessionId: string) => {
    setExpandedId((current) => (current === sessionId ? null : sessionId))
  }

  return (
    <div className="flex flex-col gap-4 bg-white p-6">
      <SessionBoardHeader planTitle={planTitle} sessions={sessions} />

      <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
        {pageItems.map((session) => (
          <SessionBoardRow
            key={session.id}
            session={session}
            proposal={proposal}
            canSchedule={canSchedule}
            isExpanded={session.id === expandedId}
            onToggleObjective={() => handleToggleObjective(session.id)}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium text-[#6B7280]">
          Sessions {start + 1}–{Math.min(start + SESSIONS_PER_PAGE, total)} of {total}
        </p>
        {totalPages > 1 && (
          <LearnRequestPagination
            currentPage={currentPage}
            totalCount={total}
            take={SESSIONS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  )
}

export default SessionsList
