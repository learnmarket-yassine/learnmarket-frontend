import { Skill } from '@/types/skill'
import SkillOption from './SkillOption'
import LoadingRow from './LoadingRow'

interface SkillsDropdownProps {
  id: string
  isLoading: boolean
  isFetching: boolean
  options: Skill[]
  query: string
  onSelect: (skill: Skill) => void
  onCreateCustom?: () => void
}

function SkillsDropdown({
  id,
  isLoading,
  isFetching,
  options,
  query,
  onSelect,
  onCreateCustom,
}: SkillsDropdownProps) {
  return (
    <div id={id} role="listbox" className="max-h-60 overflow-y-auto">
      {isLoading ? (
        <LoadingRow label="Searching..." />
      ) : options.length === 0 ? (
        <div className="px-3 py-2 text-sm text-[#5E5E5E]">
          No skills found
          {onCreateCustom && (
            <button
              type="button"
              onClick={onCreateCustom}
              className="mt-1 block text-left text-[#143681] hover:underline"
            >
              Add &quot;{query.trim()}&quot; as a new skill
            </button>
          )}
        </div>
      ) : (
        <>
          {options.map((skill) => (
            <SkillOption key={skill.id} skill={skill} onSelect={onSelect} />
          ))}
          {isFetching && <LoadingRow label="Updating..." size="sm" />}
        </>
      )}
    </div>
  )
}

export default SkillsDropdown
