import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { ProposalFormValues } from '../../schemas'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import DeleteButton from '@/features/myProfile/components/ui/DeleteButton'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useSortable } from '@dnd-kit/sortable'

type SortableSessionCardProps = {
  id: string
  index: number
  canReorder: boolean
  canRemove: boolean
  register: UseFormRegister<ProposalFormValues>
  errors: FieldErrors<ProposalFormValues>
  onRemove: () => void
}

const SortableProposalSessionCard = ({
  id,
  index,
  canReorder,
  canRemove,
  register,
  errors,
  onRemove,
}: SortableSessionCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`space-y-1 rounded-xl p-2 ${isDragging ? 'z-10 bg-[#F5F7FA] shadow-md' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {canReorder && (
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="cursor-grab touch-none text-[#8E949F] active:cursor-grabbing"
              aria-label={`Reorder session ${index + 1}`}
            >
              <GripVertical className="size-4" />
            </button>
          )}
          <span className="text-base font-semibold text-[#143681]">Session {index + 1}</span>
        </div>
        {canRemove && <DeleteButton onClick={onRemove} label={`Remove session ${index + 1}`} />}
      </div>
      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label
            htmlFor={`sessionPlans.${index}.title`}
            className="text-sm font-semibold text-[#374151]"
          >
            Title
          </Label>
          <Input
            id={`sessionPlans.${index}.title`}
            {...register(`sessionPlans.${index}.title`)}
            placeholder="e.g. Introduction to variables"
          />
          {errors.sessionPlans?.[index]?.title && (
            <p className="text-xs text-destructive">{errors.sessionPlans[index]?.title?.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor={`sessionPlans.${index}.objective`}
            className="text-sm font-semibold text-[#374151]"
          >
            Objective (optional)
          </Label>
          <Textarea
            id={`sessionPlans.${index}.objective`}
            {...register(`sessionPlans.${index}.objective`)}
            className="h-20 resize-none"
            placeholder="What the learner should be able to do after this session"
          />
        </div>
      </div>
    </div>
  )
}

export default SortableProposalSessionCard
