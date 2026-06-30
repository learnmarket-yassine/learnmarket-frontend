import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, ChevronUp, ChevronDown, Check } from 'lucide-react'

export type LanguageOption = {
  label: string
  value: string
}

type LanguageSelectProps = {
  options: LanguageOption[]
  placeholder?: string
  defaultValue?: string
  value?: string
  onChange: (selected: LanguageOption) => void
}

export default function LanguageSelect({
  options,
  placeholder = 'Search for language',
  defaultValue,
  value,
  onChange,
}: LanguageSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentValue = value !== undefined ? value : internalValue
  const selectedOption = options.find((opt) => opt.value === currentValue)

  const filtered = useMemo(() => {
    if (!query.trim()) return options
    const q = query.trim().toLowerCase()
    return options.filter((opt) => opt.label.toLowerCase().includes(q))
  }, [query, options])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(option: LanguageOption) {
    setInternalValue(option.value)
    onChange(option)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-full border px-5 py-3 text-sm transition-colors focus:outline-none focus:ring-2"
      >
        <span className={selectedOption ? '' : 'text-zinc-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border bg-white p-3 shadow-lg">
          {/* Search input */}
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Ex: ${options[0]?.label ?? 'English'}`}
              className="w-full rounded-full border py-2.5 pl-10 pr-4 text-sm focus:outline-none"
            />
          </div>

          {/* List */}
          <div className="max-h-60 overflow-y-auto pr-1 [scrollbar-color:#52525b_transparent] [scrollbar-width:thin]">
            {filtered.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm">No language found.</p>
            ) : (
              <ul>
                {filtered.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(option)}
                      className="flex w-full items-center gap-4 rounded-full px-3 py-2.5 text-left font-medium transition-colors hover:bg-[#143681] hover:text-white"
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                        {option.value === currentValue && <Check className="h-4 w-4" />}
                      </span>
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
