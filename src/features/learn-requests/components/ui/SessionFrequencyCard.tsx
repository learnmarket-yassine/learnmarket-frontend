import { cn } from '@/lib/utils'

type SessionFrequencyCardProps = {
  selected: boolean
  setSessionsPerWeek: (num: number | null) => void
  num: number
}

const SessionFrequencyCard: React.FC<SessionFrequencyCardProps> = ({
  selected,
  setSessionsPerWeek,
  num,
}) => {
  return (
    <button
      type="button"
      onClick={() => setSessionsPerWeek(num)}
      className={cn(
        'flex flex-col items-center rounded-xl border p-6 transition-colors',
        selected
          ? 'border-[#143681] bg-[#143681] text-white'
          : 'border-[#C3C6D7] hover:border-[#143681]'
      )}
    >
      <span className="font-medium">
        {num} session{num > 1 ? 's' : ''}
      </span>
      <span className="text-sm">per week</span>
    </button>
  )
}

export default SessionFrequencyCard
