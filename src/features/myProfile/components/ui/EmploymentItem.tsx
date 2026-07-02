import { Button } from '@/components/ui/button'
import EditButton from '../ui/EditButton'
import TrashIcon from '@/assets/TrashIcon'

interface EmploymentItemProps {
  title: string
  company: string
  period: string
  description: string
}

function EmploymentItem({ title, company, period, description }: EmploymentItemProps) {
  return (
    <div className="space-y-8 py-8">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-2">
          <p className="text-xl font-semibold text-[#143681]">
            {title} | {company}
          </p>
          <p className="text-base text-[#143681]">{period}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <EditButton label={`Edit ${title} at ${company}`} />
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Delete ${title} at ${company}`}
            className="h-10 w-10 rounded-full border border-[#2563EB] text-[#2563EB]"
          >
            <TrashIcon className="size-5" />
          </Button>
        </div>
      </div>
      <p className="text-base leading-relaxed text-[#143681]">{description}</p>
    </div>
  )
}
export default EmploymentItem
