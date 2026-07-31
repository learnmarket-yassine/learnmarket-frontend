import { Proposal, Session } from '../../types/dto'
import ViewSessionDetailsModal from './viewSessionDetailsModal'
import { SessionStatus } from '../../types/enums'
import ScheduleSessionModal from './ScheduleSessionModal'

type SessionItemProps = {
  session: Session
  proposal: Proposal
}

type StatusConfig = {
  label: string
  headerBg: string
}

const STATUS_CONFIG: Record<SessionStatus, StatusConfig> = {
  LOCKED: {
    label: 'Locked',
    headerBg: 'bg-slate-400',
  },
  PENDING_SCHEDULE: {
    label: 'Ready to schedule',
    headerBg: 'bg-[#2563EB]',
  },
  HELD: {
    label: 'Pending confirmation',
    headerBg: 'bg-amber-500',
  },
  BOOKED: {
    label: 'Booked',
    headerBg: 'bg-emerald-600',
  },
  PENDING_REVIEW: {
    label: 'Awaiting review',
    headerBg: 'bg-purple-600',
  },
  COMPLETED: {
    label: 'Completed',
    headerBg: 'bg-slate-600',
  },
  CANCELLED: {
    label: 'Cancelled',
    headerBg: 'bg-red-500',
  },
}

const SessionItem = ({ session, proposal }: SessionItemProps) => {
  const config = STATUS_CONFIG[session.status]

  return (
    <div className="flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div>
        <div
          className={`flex items-center justify-between rounded-sm px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white ${config.headerBg}`}
        >
          <span>Session {session.sessionNumber}</span>

          <span>{config.label}</span>
        </div>

        <div className="p-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">{session.title}</h3>

            <div className="flex items-center gap-2">
              <ViewSessionDetailsModal session={session} />

              {['HELD', 'PENDING_SCHEDULE'].includes(session.status) && (
                <ScheduleSessionModal
                  session={session}
                  tutorId={proposal.tutorId}
                  durationMinutes={proposal.sessionDurationMinutes}
                />
              )}
            </div>
          </div>

          <p className="text-xs leading-relaxed text-slate-600">
            <strong>Objective:</strong> {session.objective ?? 'No objective provided yet.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SessionItem
