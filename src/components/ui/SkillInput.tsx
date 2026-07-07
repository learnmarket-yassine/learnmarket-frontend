import { useEffect, useId, useRef, useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import useSkillSearch from '@/hooks/useSkillSearch'
import { Skill } from '@/types/skill'

interface SkillsInputProps {
  value: Skill[]
  onChange: (skills: Skill[]) => void
  placeholder?: string
  maxSkills?: number
  error?: string
  className?: string
  dropdownZIndex?: string
  onCreateCustom?: (label: string) => void
}

function SkillsInput({
  value = [],
  onChange,
  placeholder = 'Search skills e.g. React, SQL, Figma...',
  maxSkills,
  error,
  className,
  dropdownZIndex = 'z-50',
  onCreateCustom,
}: SkillsInputProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  const { results, isLoading, isFetching } = useSkillSearch(query)

  const atLimit = maxSkills ? value.length >= maxSkills : false

  const selectedIds = new Set(value.map((skill) => skill.id))

  const options = results.filter((skill) => !selectedIds.has(skill.id))

  const hasQuery = query.trim() !== ''

  const showDropdown = isOpen && !atLimit && hasQuery

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const addSkill = (skill: Skill): void => {
    if (atLimit || selectedIds.has(skill.id)) return

    onChange([...value, skill])
    setQuery('')
    setIsOpen(false)
  }

  const removeSkill = (skillId: string): void => {
    onChange(value.filter((skill) => skill.id !== skillId))
  }

  const handleCreateCustom = (): void => {
    if (!onCreateCustom || atLimit) return

    const label = query.trim()

    if (!label) return

    onCreateCustom(label)
    setQuery('')
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    // Remove last selected skill when input is empty
    if (e.key === 'Backspace' && query === '' && value.length > 0) {
      removeSkill(value[value.length - 1].id)
    }

    // Disable keyboard selection/navigation
    if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
    }
  }

  return (
    <div className="w-full space-y-2" ref={containerRef}>
      <div className="relative">
        <div
          className={cn(
            'flex flex-wrap gap-2 rounded-lg border border-[#6B7280] bg-white p-2',
            error && 'border-red-600',
            className
          )}
        >
          {value.map((skill) => (
            <span
              key={skill.id}
              className="flex items-center gap-1 rounded-full bg-[#EBEBEB] px-2 py-1 text-base text-[#5E5E5E]"
            >
              {skill.name}

              <button
                type="button"
                onClick={() => removeSkill(skill.id)}
                className="transition"
                aria-label={`Remove ${skill.name}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={atLimit ? '' : placeholder}
            disabled={atLimit}
            role="combobox"
            aria-expanded={showDropdown}
            aria-autocomplete="list"
            aria-controls={listboxId}
            className="min-w-[120px] flex-1 py-1 text-sm outline-none disabled:cursor-not-allowed disabled:bg-transparent"
          />
        </div>

        {showDropdown && (
          <div
            id={listboxId}
            role="listbox"
            className={cn(
              'absolute mt-1 max-h-60 w-full overflow-auto rounded-lg border border-[#6B7280] bg-white shadow-lg',
              dropdownZIndex
            )}
          >
            {isLoading ? (
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-[#5E5E5E]">
                <Loader2 className="size-4 animate-spin" />
                Searching...
              </div>
            ) : options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-[#5E5E5E]">
                No skills found
                {onCreateCustom && (
                  <button
                    type="button"
                    onClick={handleCreateCustom}
                    className="mt-1 block text-left text-[#143681] hover:underline"
                  >
                    Add &quot;{query.trim()}&quot; as a new skill
                  </button>
                )}
              </div>
            ) : (
              <>
                {options.map((skill) => (
                  <button
                    key={skill.id}
                    id={`skill-option-${skill.id}`}
                    role="option"
                    type="button"
                    onClick={() => addSkill(skill)}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-[#F3F3FE] hover:text-[#143681]"
                  >
                    {skill.name}
                  </button>
                ))}

                {isFetching && (
                  <div className="flex items-center gap-2 px-3 py-2 text-xs text-[#5E5E5E]">
                    <Loader2 className="size-3 animate-spin" />
                    Updating...
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {maxSkills && (
          <p className={`text-sm ${atLimit ? 'text-red-600' : 'text-[#5E5E5E]'}`}>
            {value.length} / {maxSkills} skills
          </p>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}

export default SkillsInput
