import { useId } from 'react'
import { cn } from '@/lib/utils'
import { Skill } from '@/types/skill'
import useSkillsInput from '@/hooks/useSkillInput'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import SkillsDropdown from './SkillsDropdown'
import SkillsInputFooter from './SkillsInputFooter'

interface SkillsInputProps {
  value: Skill[]
  onChange: (skills: Skill[]) => void
  placeholder?: string
  maxSkills?: number
  error?: string
  className?: string
}

function SkillsInput({
  value = [],
  onChange,
  placeholder = 'Search skills e.g. React, SQL, Figma...',
  maxSkills,
  error,
  className,
}: SkillsInputProps) {
  const listboxId = useId()

  const {
    query,
    options,
    isLoading,
    isFetching,
    atLimit,
    showDropdown,
    addSkill,
    handleKeyDown,
    handleInputChange,
    openDropdown,
    closeDropdown,
  } = useSkillsInput({ value, onChange, maxSkills })

  return (
    <div className="w-full space-y-2">
      <Popover open={showDropdown} onOpenChange={(open) => !open && closeDropdown()} modal>
        <PopoverAnchor asChild>
          <div
            className={cn(
              'flex flex-wrap gap-2 rounded-lg border border-[#6B7280] bg-white p-2',
              error && 'border-red-600',
              className
            )}
          >
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={openDropdown}
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
        </PopoverAnchor>

        <PopoverContent
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="w-[var(--radix-popover-trigger-width)] p-0"
        >
          <SkillsDropdown
            id={listboxId}
            isLoading={isLoading}
            isFetching={isFetching}
            options={options}
            query={query}
            onSelect={addSkill}
          />
        </PopoverContent>
      </Popover>

      <SkillsInputFooter value={value} maxSkills={maxSkills} atLimit={atLimit} error={error} />
    </div>
  )
}

export default SkillsInput
