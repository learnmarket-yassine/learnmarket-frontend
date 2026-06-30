import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, Check } from 'lucide-react'

export type ProficiencyOption = {
  label: string
  value: string
  description?: string
}

type ProficiencySelectProps = {
  options: ProficiencyOption[]
  placeholder?: string
  defaultValue?: string
  value?: string
  onChange: (selected: ProficiencyOption) => void
  error?: boolean
}

export default function ProficiencySelect({
  options,
  placeholder = 'Search for proficiency level',
  defaultValue,
  value,
  onChange,
  error,
}: ProficiencySelectProps) {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentValue = value !== undefined ? value : internalValue
  const selectedOption = options.find((opt) => opt.value === currentValue)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(option: ProficiencyOption) {
    setInternalValue(option.value)
    onChange(option)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full font-sans">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-full border px-5 py-3 text-sm transition-colors focus:outline-none focus:ring-2 ${
          error ? 'border-destructive' : ''
        }`}
      >
        <span className={selectedOption ? '' : 'text-zinc-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border bg-white p-3 shadow-lg">
          <ul className="max-h-80 overflow-y-auto pr-1 [scrollbar-color:#52525b_transparent] [scrollbar-width:thin]">
            {options.map((option) => {
              const isSelected = option.value === currentValue
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`flex w-full items-start gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-[#143681] hover:text-white`}
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                      {isSelected && <Check className="h-4 w-4" />}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold">{option.label}</span>
                      {option.description && (
                        <span className="text-xs font-normal leading-snug text-current opacity-70">
                          {option.description}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
