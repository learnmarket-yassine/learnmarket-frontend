import { memo } from 'react'
import { Search } from 'lucide-react'
import { Input } from './input'
import ClearInputIcon from '@/assets/ClearInputIcon'

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  placeholder?: string
}

const SearchInput = memo(({ value, onChange, onClear, placeholder }: SearchInputProps) => {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Filter...'}
        className="pl-10 pr-10"
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors"
        >
          <ClearInputIcon />
        </button>
      )}
    </div>
  )
})

SearchInput.displayName = 'SearchInput'

export default SearchInput
