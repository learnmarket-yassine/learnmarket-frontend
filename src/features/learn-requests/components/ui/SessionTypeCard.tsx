import { cn } from '@/lib/utils'
import { LearnRequestType } from '@/features/learn-requests/store/types'

type SessionTypeCardProps = {
  type: LearnRequestType
  title: string
  description: string
  selected?: boolean
  onClick?: () => void
}

const SessionTypeCard: React.FC<SessionTypeCardProps> = ({
  selected = false,
  title,
  description,
  onClick,
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      className={cn(
        'flex cursor-pointer flex-col items-start gap-3 rounded-xl border px-6 py-10 transition-colors',
        'hover:border-[#143681] hover:bg-[#143681] hover:text-white',
        selected && 'border-[#143681] bg-[#143681] text-white'
      )}
    >
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-base">{description}</p>
    </div>
  )
}

export default SessionTypeCard
