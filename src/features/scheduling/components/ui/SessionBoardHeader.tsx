import { cn } from '@/lib/utils'
import type { Session } from '../../types/dto'
import { SESSION_BOARD_STYLES, getSessionBoardBucket } from '../../utils/sessionBoard'

const LEGEND_BUCKETS = ['completed', 'ready', 'not-ready'] as const

type SessionBoardHeaderProps = {
  planTitle: string
  sessions: Session[]
}

const SessionBoardHeader = ({ planTitle, sessions }: SessionBoardHeaderProps) => {
  const total = sessions.length
  const completedCount = sessions.filter(
    (session) => getSessionBoardBucket(session.status) === 'completed'
  ).length
  const readyCount = sessions.filter(
    (session) => getSessionBoardBucket(session.status) === 'ready'
  ).length

  const completedPct = total > 0 ? (completedCount / total) * 100 : 0
  const readyPct = total > 0 ? (readyCount / total) * 100 : 0

  return (
    <div className="space-y-3 border-b border-[#E0E2E6] pb-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-[#1E293B]">{planTitle}</h2>
        <p className="text-sm font-medium text-[#6B7280]">
          {readyCount} ready to schedule · {completedCount} completed of {total}
        </p>
      </div>

      <div
        role="progressbar"
        aria-valuenow={completedCount + readyCount}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${completedCount} completed and ${readyCount} ready to schedule out of ${total} sessions`}
        className="flex h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
      >
        <div
          className={cn('h-full', SESSION_BOARD_STYLES.completed.segmentClassName)}
          style={{ width: `${completedPct}%` }}
        />
        <div
          className={cn('h-full', SESSION_BOARD_STYLES.ready.segmentClassName)}
          style={{ width: `${readyPct}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#6B7280]">
        {LEGEND_BUCKETS.map((bucket) => (
          <span key={bucket} className="flex items-center gap-1.5">
            <span
              className={cn('size-2 rounded-full', SESSION_BOARD_STYLES[bucket].segmentClassName)}
              aria-hidden="true"
            />
            {SESSION_BOARD_STYLES[bucket].legendLabel}
          </span>
        ))}
      </div>
    </div>
  )
}

export default SessionBoardHeader
