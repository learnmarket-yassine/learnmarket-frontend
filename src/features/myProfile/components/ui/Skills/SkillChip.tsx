import { X } from 'lucide-react'
import { Skill } from '@/types/skill'

interface SkillChipProps {
  skill: Skill
  onRemove: (skillId: string) => void
}

function SkillChip({ skill, onRemove }: SkillChipProps) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-[#EBEBEB] px-2 py-1 text-base text-[#5E5E5E]">
      {skill.name}
      <button
        type="button"
        onClick={() => onRemove(skill.id)}
        className="transition"
        aria-label={`Remove ${skill.name}`}
      >
        <X size={12} />
      </button>
    </span>
  )
}

export default SkillChip
