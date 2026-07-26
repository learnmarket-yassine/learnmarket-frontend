import { Session } from '../../types/dto'
import { cn } from '@/lib/utils'
import {
  isSessionActionable,
  SESSION_STATUS_ICON,
  SESSION_STATUS_LABELS,
} from '../../utils/sessions'

type CourseStepProps = {
  session: Session
  isActive: boolean
  onSelectSession: (session: Session) => void
}

const NON_ACTIONABLE_CLASSNAMES: Partial<Record<Session['status'], string>> = {
  BOOKED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  COMPLETED: 'border-blue-200 bg-blue-50 text-[#2563EB]',
}

const CourseStep: React.FC<CourseStepProps> = ({ session, isActive, onSelectSession }) => {
  const isActionable = isSessionActionable(session.status)
  const StatusIcon = SESSION_STATUS_ICON[session.status]

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-sm border px-10 py-3 transition-colors',
        isActionable
          ? 'cursor-pointer border-[#1a46a7] text-[#1a46a7] hover:bg-[#1a46a7] hover:text-white'
          : cn(
              'cursor-not-allowed',
              NON_ACTIONABLE_CLASSNAMES[session.status] ??
                'border-gray-300 bg-gray-50 text-gray-400'
            ),
        isActionable && isActive && 'bg-[#1a46a7] text-white'
      )}
      aria-disabled={!isActionable}
      aria-current={isActive}
      onClick={() => isActionable && onSelectSession(session)}
    >
      <h2 className="font-bold">{session.title}</h2>

      <span className="flex items-center gap-1.5 whitespace-nowrap text-xs font-medium">
        <StatusIcon className="h-5 w-5" />
        {!isActionable && SESSION_STATUS_LABELS[session.status]}
      </span>
    </div>
  )
}

export default CourseStep
