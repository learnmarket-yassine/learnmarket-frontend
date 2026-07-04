import { useState, KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SkillsInputProps {
  value: string[]
  onChange: (skills: string[]) => void
  placeholder?: string
  maxSkills?: number
  error?: string
  className?: string
}

function SkillsInput({
  value = [],
  onChange,
  placeholder = 'e.g. React, SQL, Figma...',
  maxSkills,
  error,
  className,
}: SkillsInputProps) {
  const [draft, setDraft] = useState<string>('')

  const addSkill = (): void => {
    const clean = draft.trim()
    if (!clean) return
    if (value.some((s) => s.toLowerCase() === clean.toLowerCase())) {
      setDraft('')
      return
    }
    if (maxSkills && value.length >= maxSkills) return
    onChange([...value, clean])
    setDraft('')
  }

  const removeSkill = (skill: string): void => {
    onChange(value.filter((s) => s !== skill))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill()
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      removeSkill(value[value.length - 1])
    }
  }

  const atLimit = maxSkills ? value.length >= maxSkills : false

  return (
    <div className="w-full space-y-2">
      <div
        className={cn(
          'flex flex-wrap gap-2 rounded-lg border border-[#6B7280] bg-white p-2',
          error && 'border-red-600',
          className
        )}
      >
        {value.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-1 rounded-full bg-[#EBEBEB] px-2 py-1 text-base text-[#5E5E5E]"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="transition"
              aria-label={`Remove ${skill}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={atLimit ? '' : placeholder}
          disabled={atLimit}
          className="min-w-[120px] flex-1 py-1 text-sm outline-none disabled:cursor-not-allowed disabled:bg-transparent"
        />
      </div>
      <div className="flex items-center justify-between">
        {maxSkills && (
          <p className={`text-sm ${atLimit ? 'text-red-600' : 'text-[#5E5E5E]'}`}>
            Maximum {maxSkills} skills.
          </p>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}
export default SkillsInput
