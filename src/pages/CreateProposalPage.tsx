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
import { TYPE_BADGE_STYLES } from '@/features/Accueil/components/ui/TutorLearningRequestCard'
import { formatLabel, LEVEL_LABELS, TYPE_LABELS } from '@/features/learn-requests/constants/labels'
import useGetLearnRequest from '@/features/learn-requests/hooks/useGetLearnRequest'
import SkillChip from '@/features/myProfile/components/ui/Skills/SkillChip'
import useLineClamp from '@/hooks/useLineClamp'
import { formatBudget } from '@/lib/utils'
import { GraduationCap, Tag, TypeIcon, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

const DESCRIPTION_LINES = 3
const CreateProposalPage = () => {
  const params = useParams()
  const [totalAmount, setTotalAmount] = useState(0)
  const hourlyRate = Number(totalAmount || 0)
  const SERVICE_FEE_PERCENT = 0.1
  const serviceFee = hourlyRate * SERVICE_FEE_PERCENT
  const youReceive = hourlyRate * (1 + SERVICE_FEE_PERCENT)

  const { data, isLoading, isError } = useGetLearnRequest(params.id)
  const {
    ref: descriptionRef,
    isExpanded,
    isClampable,
    toggle,
    className: clampClassName,
  } = useLineClamp(data?.description, { lines: DESCRIPTION_LINES })

  if (!data) return null
  const typeLabel =
    data.type === 'COURSE' && data.requestedFrequency
      ? `${formatLabel(TYPE_LABELS, data.type)} · ${data.requestedFrequency}x/week`
      : formatLabel(TYPE_LABELS, data.type)
  return (
    <div className="space-y-8">
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
            <div className="flex-1 space-y-5 p-5">
              <h1 className="text-lg font-semibold">{data?.title}</h1>
              <div className="flex items-center gap-3">
                {data.type && TypeIcon && (
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${TYPE_BADGE_STYLES[data.type]}`}
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
                  {data.description}
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
                {data.preferredLanguages.length === 0 ? (
                  <p className="italic">Not set</p>
                ) : (
                  <p className="text-lg">{data.preferredLanguages.join(', ')}</p>
                )}
              </div>
            </div>
            <div className="flex w-[300px] shrink-0 flex-col border-l border-[#E0E2E6] p-8">
              <div className="space-y-4">
                <div className="flex items-start gap-6 text-lg">
                  <GraduationCap className="size-6 text-[#143681]" />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold">
                      {formatLabel(LEVEL_LABELS, data.level)}
                    </span>
                    <span className="text-xs font-semibold text-[#6B7280]">Cuurent level</span>
                  </div>
                </div>
                <div className="flex items-start gap-6 text-lg">
                  <Wallet className="size-5 text-[#143681]" />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold">
                      {formatBudget(data.budgetMin)} - {formatBudget(data.budgetMax)} USD
                    </span>
                    <span className="text-xs font-semibold text-[#6B7280]">Budget range</span>
                  </div>
                </div>
                <div className="flex items-start gap-6 text-lg">
                  <Tag className="size-5 text-[#143681]" />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold">
                      {data.category?.name ?? 'Uncategorized'}
                    </span>
                    <span className="text-xs font-semibold text-[#6B7280]">Category</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-4 p-5">
            <h3 className="text-xl font-bold">Skills and expertise</h3>
            <div className="flex max-h-[250px] flex-wrap gap-2 overflow-auto rounded-lg p-3">
              {data.skills.length === 0 ? (
                <p className="italic text-gray-400">Not set</p>
              ) : (
                data.skills.map(({ skill }) => <SkillChip key={skill.id} name={skill.name} />)
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4 rounded-3xl border border-[#E0E2E6] bg-white p-5">
        <h3 className="text-xl font-bold">Terms</h3>
        <p>How do you want to be paid?</p>
        <RadioGroup className="space-y-4">
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
                Receive your full payment after all sessions have been completed and approved by the
                learner.
              </p>
            </div>
          </div>
        </RadioGroup>
        <div className="divide-y-[1px] divide-[#8E949F]">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-base font-bold text-[#143681]">
                Your Earnings
              </Label>
              <p className="text-base text-[#5E5E5E]">The amount you'll receive.</p>
            </div>
            <div className="flex items-center gap-2">
              <InputGroup className="rounded-full border border-[#D9D9D9] p-5 has-[[data-slot=input-group-control]:focus-visible]:border-[#D9D9D9] has-[[data-slot=input-group-control]:focus-visible]:ring-0">
                <InputGroupAddon>
                  <InputGroupText className="text-base font-medium text-[#1E1E1E]">
                    $
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(Number(e.target.value))}
                  placeholder="0.00"
                  className="text-lg text-[#1E1E1E] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </InputGroup>
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
            className="h-[200px] resize-none rounded-xl border border-[#6B7280] bg-white p-4"
          />
        </div>
      </div>
    </div>
  )
}

export default CreateProposalPage
