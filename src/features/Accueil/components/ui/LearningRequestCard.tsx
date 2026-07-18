import ViewIcon from '@/assets/ViewIcon'
import { LearnRequest } from '@/features/learn-requests/store/types'

export type LearnRequestPreview = Partial<LearnRequest>

const formatStatus = (status?: string) => {
  if (!status) return ''
  if (status === 'OPEN') return 'Open'
  return status.charAt(0) + status.slice(1).toLowerCase()
}

const LearnRequestCard: React.FC<LearnRequestPreview> = ({
  status,
  level,
  category,
  title,
  budgetMax,
  budgetMin,
}) => {
  return (
    <div className="rounded-xl border border-[#6B7280] p-4">
      <div className="flex cursor-pointer items-center justify-end">
        <ViewIcon />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold leading-snug text-[#1E293B]">{title}</h3>
        <div className="flex items-start justify-between gap-2">
          <div className="rounded-lg bg-[#143681] px-6 text-white">{formatStatus(status)}</div>
        </div>
        <p className="text-xs text-[#6B7280]">
          {category?.name} · {level}
        </p>

        <p className="flex items-center gap-2">
          <span className="font-semibold">budget</span>:{' '}
          <span className="font-semibold">
            ${budgetMin ?? '—'} - ${budgetMax ?? '—'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default LearnRequestCard
