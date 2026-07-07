import { Skill } from '@/types/skill'

interface SkillsInputFooterProps {
  value: Skill[]
  maxSkills?: number
  atLimit: boolean
  error?: string
}

function SkillsInputFooter({ value, maxSkills, atLimit, error }: SkillsInputFooterProps) {
  return (
    <div className="flex items-center justify-between">
      {maxSkills && (
        <p className={`text-sm ${atLimit ? 'text-red-600' : 'text-[#5E5E5E]'}`}>
          {value.length} / {maxSkills} skills
        </p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default SkillsInputFooter
