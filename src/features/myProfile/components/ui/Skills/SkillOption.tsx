import { Skill } from '@/types/skill'

interface SkillOptionProps {
  skill: Skill
  onSelect: (skill: Skill) => void
}

function SkillOption({ skill, onSelect }: SkillOptionProps) {
  return (
    <button
      type="button"
      id={`skill-option-${skill.id}`}
      role="option"
      onClick={() => onSelect(skill)}
      className="block w-full px-3 py-2 text-left text-sm hover:bg-[#F3F3FE] hover:text-[#143681]"
    >
      {skill.name}
    </button>
  )
}

export default SkillOption
