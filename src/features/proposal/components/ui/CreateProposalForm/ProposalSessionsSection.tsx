import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableProposalSessionCard from '../SortableProposalSessionCard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayMove,
  UseFieldArrayRemove,
  UseFormRegister,
} from 'react-hook-form'
import { ProposalFormValues } from '@/features/proposal/schemas'

type SessionPlanField = FieldArrayWithId<ProposalFormValues, 'sessionPlans', 'fieldId'>

const isPersistedSessionPlan = (field: SessionPlanField) => !!field.id

type ProposalFormSessionsSectionProps = {
  learnRequestType: string | null
  register: UseFormRegister<ProposalFormValues>
  errors: FieldErrors<ProposalFormValues>
  fields: SessionPlanField[]
  append: UseFieldArrayAppend<ProposalFormValues, 'sessionPlans'>
  remove: UseFieldArrayRemove
  move: UseFieldArrayMove
}

const ProposalFormSessionsSection: React.FC<ProposalFormSessionsSectionProps> = ({
  learnRequestType,
  register,
  errors,
  fields,
  move,
  remove,
  append,
}) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const oldIndex = fields.findIndex((field) => field.fieldId === active.id)
    const newIndex = fields.findIndex((field) => field.fieldId === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      move(oldIndex, newIndex)
    }
  }
  const isOneTime = learnRequestType === 'ONE_TIME'

  return (
    <div className="flex flex-col space-y-4 rounded-3xl border border-[#E0E2E6] bg-white p-5">
      <h3 className="text-xl font-bold">Sessions details</h3>
      <div className="max-h-[500px] overflow-y-auto">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={fields.map((field) => field.fieldId)}
            strategy={verticalListSortingStrategy}
          >
            {fields.map((field, index) => (
              <SortableProposalSessionCard
                key={field.fieldId ?? index}
                id={field.fieldId}
                index={index}
                isPersisted={isPersistedSessionPlan(field)}
                canReorder={!isOneTime && fields.length > 1}
                canRemove={!isOneTime && fields.length > 1}
                register={register}
                errors={errors}
                onRemove={() => remove(index)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      {errors.sessionPlans?.message && (
        <p className="text-xs text-destructive">{errors.sessionPlans.message}</p>
      )}
      {!isOneTime && (
        <div className="flex items-center justify-end">
          <Button
            type="button"
            variant={'outline'}
            onClick={() => append({ title: '', objective: '' })}

            className="flex h-full w-fit items-center gap-3 rounded-full border border-[#004AC6] px-8 py-3 text-base text-[#004AC6] hover:text-[#004AC6]"
          >
            <Plus className="size-4" /> Add another session
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProposalFormSessionsSection
