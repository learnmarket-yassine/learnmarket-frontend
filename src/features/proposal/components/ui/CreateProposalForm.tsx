import LanguagesIcon from '@/assets/LanguagesIcon'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import {
  TYPE_BADGE_STYLES,
  TYPE_ICONS,
} from '@/features/Accueil/components/ui/TutorLearningRequestCard'
import { formatLabel, LEVEL_LABELS, TYPE_LABELS } from '@/features/learn-requests/constants/labels'
import SkillChip from '@/features/myProfile/components/ui/Skills/SkillChip'
import useLineClamp from '@/hooks/useLineClamp'
import { formatBudget } from '@/lib/utils'
import { GraduationCap, GripVertical, Plus, Tag, Wallet } from 'lucide-react'
import { Controller, useFieldArray, useForm, UseFormRegister } from 'react-hook-form'
import { buildProposalSchema, ProposalFormValues } from '../../schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { LearnRequest } from '@/features/learn-requests/store/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import DeleteButton from '@/features/myProfile/components/ui/DeleteButton'
import { useNavigate } from 'react-router-dom'
import useCreateProposal from '../../hooks/useCreateProposal'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FieldErrors } from 'react-hook-form'

type CreateProposalFormProps = {
  learnrequest: LearnRequest
}

type SortableSessionCardProps = {
  id: string
  index: number
  canReorder: boolean
  canRemove: boolean
  register: UseFormRegister<ProposalFormValues>
  errors: FieldErrors<ProposalFormValues>
  onRemove: () => void
}

const SortableSessionCard = ({
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

const DESCRIPTION_LINES = 3
const CreateProposalForm = ({ learnrequest }: CreateProposalFormProps) => {
  const schema = buildProposalSchema(learnrequest.type ?? 'ONE_TIME')
  const form = useForm<ProposalFormValues>({
    resolver: schema ? zodResolver(schema) : undefined,
    mode: 'onChange',
    defaultValues: {
      sessionDurationMinutes: 60,
      totalPrice: undefined,
      payoutMethod: 'ON_COMPLETION',
      message: '',
      sessionPlans: [{ title: '', objective: '' }],
    },
  })
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'sessionPlans',
  })
  const { register, handleSubmit, formState, watch } = form
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const oldIndex = fields.findIndex((field) => field.id === active.id)
    const newIndex = fields.findIndex((field) => field.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      move(oldIndex, newIndex)
    }
  }
  const { errors } = formState
  const navigate = useNavigate()
  const totalPrice = Number(watch('totalPrice') || 0)
  const SERVICE_FEE_PERCENT = 0.1
  const serviceFee = totalPrice * SERVICE_FEE_PERCENT
  const youReceive = totalPrice * (1 + SERVICE_FEE_PERCENT)

  const { handleCreateProposal, isPending: createProposalLoading } = useCreateProposal()

  const {
    ref: descriptionRef,
    isExpanded,
    isClampable,
    toggle,
    className: clampClassName,
  } = useLineClamp(learnrequest?.description, { lines: DESCRIPTION_LINES })

  const typeLabel =
    learnrequest.type === 'COURSE' && learnrequest.requestedFrequency
      ? `${formatLabel(TYPE_LABELS, learnrequest.type)} · ${learnrequest.requestedFrequency}x/week`
      : formatLabel(TYPE_LABELS, learnrequest.type)

  const TypeIcon = learnrequest.type ? TYPE_ICONS[learnrequest.type] : undefined
  const isOneTime = learnrequest.type === 'ONE_TIME'
  const isSingleSession = fields.length === 1

  const onSubmit = (values: ProposalFormValues) => {
    const learnerTotal = values.totalPrice * (1 + SERVICE_FEE_PERCENT)
    handleCreateProposal({
      learnRequestId: learnrequest.id,
      payload: { ...values, totalPrice: learnerTotal },
    })
  }
  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation()
        handleSubmit(onSubmit)(e)
      }}
      className="space-y-8"
      noValidate
    >
      <h1 className="text-4xl font-bold text-[#1E293B]">Submit a proposal</h1>
      <div className="flex flex-col space-y-4 rounded-3xl border border-[#E0E2E6] bg-white p-5">
        <h3 className="text-xl font-bold">Proposal settings</h3>
        <p>This proposal requires 5 Connects</p>
        <p>When you submit this proposal, you'll have 50 Connects remaining.</p>
      </div>
      <div className="flex flex-col space-y-4 rounded-3xl border border-[#E0E2E6] bg-white p-5">
        <h3 className="text-xl font-bold">Job Details</h3>
        <div className="divide-y divide-[#E0E2E6]">
          <div className="flex overflow-y-auto">
            <div className="flex-1 space-y-5 pb-5 pr-5">
              <h1 className="text-lg font-semibold">{learnrequest?.title}</h1>
              <div className="flex items-center gap-3">
                {learnrequest.type && TypeIcon && (
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${TYPE_BADGE_STYLES[learnrequest.type]}`}
                  >
                    <TypeIcon className="size-3.5" />
                    {typeLabel}
                  </span>
                )}
                <p>Posted Jul 21, 2026</p>
              </div>
              <div>
                <p
                  ref={descriptionRef}
                  className={`${clampClassName} text-base font-medium text-[#1E293B]`}
                >
                  {learnrequest.description}
                </p>
                {isClampable && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggle()
                    }}
                    className="text-sm font-semibold text-[#565A60] underline"
                  >
                    {isExpanded ? 'See less' : 'See more'}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <h3 className="flex items-center gap-2 font-semibold">
                  <LanguagesIcon /> Preferred Languages :
                </h3>
                {learnrequest.preferredLanguages.length === 0 ? (
                  <p className="italic">Not set</p>
                ) : (
                  <p className="text-lg">{learnrequest.preferredLanguages.join(', ')}</p>
                )}
              </div>
            </div>
            <div className="flex w-[300px] shrink-0 flex-col border-l border-[#E0E2E6] p-8">
              <div className="space-y-4">
                <div className="flex items-start gap-6 text-lg">
                  <GraduationCap className="size-6 text-[#143681]" />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold">
                      {formatLabel(LEVEL_LABELS, learnrequest.level)}
                    </span>
                    <span className="text-xs font-semibold text-[#6B7280]">Cuurent level</span>
                  </div>
                </div>
                <div className="flex items-start gap-6 text-lg">
                  <Wallet className="size-5 text-[#143681]" />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold">
                      {formatBudget(learnrequest.budgetMin)} -{' '}
                      {formatBudget(learnrequest.budgetMax)} USD
                    </span>
                    <span className="text-xs font-semibold text-[#6B7280]">Budget range</span>
                  </div>
                </div>
                <div className="flex items-start gap-6 text-lg">
                  <Tag className="size-5 text-[#143681]" />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold">
                      {learnrequest.category?.name ?? 'Uncategorized'}
                    </span>
                    <span className="text-xs font-semibold text-[#6B7280]">Category</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-4 py-5">
            <h3 className="text-xl font-bold">Skills and expertise</h3>
            <div className="flex max-h-[250px] flex-wrap gap-2 overflow-auto rounded-lg p-3">
              {learnrequest.skills.length === 0 ? (
                <p className="italic text-gray-400">Not set</p>
              ) : (
                learnrequest.skills.map(({ skill }) => (
                  <SkillChip key={skill.id} name={skill.name} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4 rounded-3xl border border-[#E0E2E6] bg-white p-5">
        <h3 className="text-xl font-bold">Sessions details</h3>
        <div className="max-h-[500px] overflow-y-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map((field) => field.id)}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <SortableSessionCard
                  key={field.id}
                  id={field.id}
                  index={index}
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
      <div className="flex flex-col space-y-4 rounded-3xl border border-[#E0E2E6] bg-white p-5">
        <h3 className="text-xl font-bold">Terms</h3>
        <div className="space-y-4">
          <p>How do you want to be paid?</p>
          <Controller
            control={form.control}
            name="payoutMethod"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSingleSession}
                className="space-y-4"
              >
                <div className="flex items-start gap-4">
                  <RadioGroupItem value="PER_SESSION" id="r1" />
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="r1" className="text-base font-bold">
                      By Session
                    </Label>
                    <p className="text-[#5E5E5E]">
                      You'll be paid for each session after it has been completed and approved.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <RadioGroupItem value="ON_COMPLETION" id="r2" />
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="r2" className="text-base font-bold">
                      By Course
                    </Label>
                    <p className="text-[#5E5E5E]">
                      Receive your full payment after all sessions have been completed and approved
                      by the learner.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            )}
          />
          {isSingleSession && (
            <p className="text-xs text-[#6B7280]">A single session is always paid by course.</p>
          )}
          {errors.payoutMethod && (
            <p className="text-xs text-destructive">{errors.payoutMethod.message}</p>
          )}
        </div>
        <div className="divide-y-[1px] divide-[#8E949F]">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-base font-bold text-[#143681]">
                Your Earnings
              </Label>
              <p className="text-base text-[#5E5E5E]">The amount you'll receive.</p>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <InputGroup className="rounded-full border border-[#D9D9D9] p-5 has-[[data-slot=input-group-control]:focus-visible]:border-[#D9D9D9] has-[[data-slot=input-group-control]:focus-visible]:ring-0">
                  <InputGroupAddon>
                    <InputGroupText className="text-base font-medium text-[#1E1E1E]">
                      $
                    </InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    type="number"
                    placeholder="0.00"
                    {...register('totalPrice', { valueAsNumber: true })}
                    className="text-lg text-[#1E1E1E] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </InputGroup>
              </div>
              {errors.totalPrice && (
                <p className="text-sm text-red-600">{errors.totalPrice.message}</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-base font-bold text-[#143681]">
                YORA Service Fee
              </Label>
              <p className="text-base text-[#5E5E5E]">10% platform service fee.</p>
            </div>
            <div className="flex items-center gap-2">
              <InputGroup className="rounded-full border border-[#D9D9D9] bg-[#E3E3E3] p-5 has-[[data-slot=input-group-control]:focus-visible]:border-[#D9D9D9] has-[[data-slot=input-group-control]:focus-visible]:ring-0">
                <InputGroupAddon>
                  <InputGroupText className="text-base font-medium text-[#1E1E1E]">
                    $
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  type="number"
                  value={serviceFee.toFixed(2)}
                  readOnly
                  placeholder="0.00"
                  className="text-lg text-[#1E1E1E] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </InputGroup>
            </div>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-base font-bold text-[#143681]">
                Learner Total
              </Label>
              <p className="text-base text-[#5E5E5E]">The total amount the learner will pay.</p>
            </div>
            <div className="flex items-center gap-2">
              <InputGroup className="rounded-full border border-[#D9D9D9] p-5 has-[[data-slot=input-group-control]:focus-visible]:border-[#D9D9D9] has-[[data-slot=input-group-control]:focus-visible]:ring-0">
                <InputGroupAddon>
                  <InputGroupText className="text-base font-medium text-[#1E1E1E]">
                    $
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  value={youReceive.toFixed(2)}
                  readOnly
                  type="number"
                  placeholder="0.00"
                  className="text-lg text-[#1E1E1E] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </InputGroup>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4 rounded-3xl border border-[#E0E2E6] bg-white p-5">
        <h3 className="text-xl font-bold">Additional details</h3>
        <div className="space-y-2">
          <Label
            htmlFor="learn-request-description"
            className="text-sm font-semibold text-[#374151]"
          >
            Cover Letter
          </Label>
          <Textarea
            id="description"
            {...register('message')}
            className="h-[200px] resize-none rounded-xl border border-[#6B7280] bg-white p-4"
          />
          {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          data-mdb-button-init
          data-mdb-ripple-init
          className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
          onClick={() => navigate('/accueil')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          data-mdb-button-init
          data-mdb-ripple-init
          className="h-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={createProposalLoading}
        >
          {createProposalLoading ? 'Submitting...' : 'Submit proposal'}
        </Button>
      </div>
    </form>
  )
}

export default CreateProposalForm
