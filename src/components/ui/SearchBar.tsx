import { cn } from '@/lib/utils'
import { CustomInput } from './CustomInput'
import SearchIcon from '@/assets/SearchIcon'

interface SearchBarProps {
  placeholder?: string
  className?: string
  onSearch?: (value: string) => void
}

function SearchBar({ placeholder = 'Recherche', className, onSearch }: SearchBarProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <CustomInput
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch?.(e.target.value)}
        className="w-80 rounded-full border border-[#D1D5DA] bg-white px-4 pr-10 text-sm outline-none placeholder:text-[#8E949F] focus-visible:border-[#D1D5DA] focus-visible:ring-0"
        aria-label="Search"
      />
      <div className="pointer-events-none absolute right-1 top-[55%] z-10 flex -translate-x-1/2 -translate-y-1/2 transform items-center">
        <SearchIcon />
      </div>
    </div>
  )
}
export default SearchBar
