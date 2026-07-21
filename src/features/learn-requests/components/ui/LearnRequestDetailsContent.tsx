import SkillChip from '@/features/myProfile/components/ui/Skills/SkillChip'
import { LearnRequest } from '../../store/types'
import { TYPE_LABELS, LEVEL_LABELS, formatLabel } from '../../constants/labels'

type Props = {
  request: LearnRequest
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <h3 className="text-lg font-semibold text-[#143681]">{label}</h3>
    {children}
  </div>
)

const toNumberOrNull = (value: string | number | null): number | null =>
  value !== null ? Number(value) : null

const LearnRequestDetailsContent = ({ request }: Props) => {
  const budgetMin = toNumberOrNull(request.budgetMin)
  const budgetMax = toNumberOrNull(request.budgetMax)
  const hasBudget = budgetMin !== null && budgetMax !== null

  return (
    <section className="space-y-8 p-6">
      <Field label="Description">
        {request.description ? (
          <p className="text-[#565a60]">{request.description}</p>
        ) : (
          <p className="italic text-gray-400">Not set</p>
        )}
      </Field>

      <Field label="Learning format">
        <p className="text-[#565a60]">{formatLabel(TYPE_LABELS, request.type)}</p>
      </Field>

      <Field label="Category">
        {request.category ? (
          <p className="text-[#565a60]">{request.category.name}</p>
        ) : (
          <p className="italic text-gray-400">Not set</p>
        )}
      </Field>

      <Field label="Skills">
        <div className="flex max-h-[250px] flex-wrap gap-2 overflow-auto rounded-lg p-3">
          {request.skills.length === 0 ? (
            <p className="italic text-gray-400">Not set</p>
          ) : (
            request.skills.map(({ skill }) => <SkillChip key={skill.id} name={skill.name} />)
          )}
        </div>
      </Field>

      <Field label="Level preferences">
        <p className="text-[#565a60]">{formatLabel(LEVEL_LABELS, request.level)}</p>
      </Field>

      <Field label="Preferred Languages">
        {request.preferredLanguages.length === 0 ? (
          <p className="italic text-gray-400">Not set</p>
        ) : (
          <p className="text-[#565a60]">{request.preferredLanguages.join(', ')}</p>
        )}
      </Field>

      {request.type === 'COURSE' && (
        <Field label="Frequency">
          {request.requestedFrequency ? (
            <p className="text-[#565a60]">{request.requestedFrequency} times per week</p>
          ) : (
            <p className="italic text-gray-400">Not set</p>
          )}
        </Field>
      )}

      <Field label="Budget">
        {hasBudget ? (
          <p className="text-lg font-medium text-[#565a60]">
            {budgetMin} - {budgetMax} TND
          </p>
        ) : (
          <p className="italic text-gray-400">Not set</p>
        )}
      </Field>
    </section>
  )
}

export default LearnRequestDetailsContent
