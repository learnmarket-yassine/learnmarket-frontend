import { memo } from 'react'
import ClearInputIcon from '@/assets/ClearInputIcon'
import { Input } from '../../input'
import { SearchInputProps } from './types'

const SearchInput = memo(({ value, onChange, onClear }: SearchInputProps) => {
  return (
    <div className="relative flex w-full items-center">
      <Input
        className="pr-9"
        placeholder="Filter..."
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-0 top-0 m-2.5 h-4 w-4 rounded-full bg-[#2C2C2C] text-white"
        >
          <ClearInputIcon />
        </button>
      )}
    </div>
  )
})

SearchInput.displayName = 'SearchInput'

export default SearchInput
