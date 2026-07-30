import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChecklistItemProps {
  label: string
  description: string
  met: boolean
  actionLabel?: string
  onAction?: () => void
}

const CheckListItem = ({ label, description, met }: ChecklistItemProps) => {
  return (
    <li
      className={cn(
        'flex items-center justify-between gap-4 border-b border-[#E5E7EB] px-4 py-4 last:border-b-0',
        !met && 'bg-[#F9FAFB]'
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full',
            met ? 'bg-[#1E40AF]' : 'border-2 border-[#D1D5DB]'
          )}
        >
          {met && <Check className="size-4 text-white" aria-hidden="true" />}
        </div>
        <div>
          <p className="text-base font-semibold text-[#111827]">{label}</p>
          <p className="text-base text-[#2b3446]">{description}</p>
        </div>
      </div>
    </li>
  )
}

export default CheckListItem
