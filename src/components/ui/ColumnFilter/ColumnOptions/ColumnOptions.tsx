import { memo, useCallback, useMemo } from 'react'
import { FilterType } from '@/features/table-filters/store/types'
import useInitialOptions from './hooks/useInitialOptions'
import { useFilterOptions } from './hooks/useFilterOptions'
import SearchInput from './SearchInput'
import OptionsList from './OptionList'

type ColumnOptionsProps = {
  optionName: string
  filterType: FilterType
  defaultKeyword: string
  setKeyword: (keyword: string) => void
  selectedRadio: string
  onSelectRadio: (option: string) => void
  onKeyDown: (event: React.KeyboardEvent) => void
}

const ColumnOptions = memo((props: ColumnOptionsProps) => {
  const {
    filterType,
    optionName,
    selectedRadio,
    onSelectRadio,
    setKeyword,
    defaultKeyword,
    onKeyDown,
  } = props
  const { initialOptions } = useInitialOptions(filterType, optionName)
  const { filteredOptions, handleSearch, clearSearch } = useFilterOptions(initialOptions)

  const handleKeywordChange = useCallback(
    (value: string) => {
      handleSearch(value)
      setKeyword(value)
    },
    [handleSearch, setKeyword]
  )

  const handleClearSearch = useCallback(() => {
    clearSearch()
    setKeyword('')
  }, [clearSearch, setKeyword])

  // Reference project only shows the search box for its async/empty-list
  // special cases; here every column's list comes from FILTER_OPTIONS, so
  // showing it whenever there's more than a handful of options to scan is
  // more useful than the reference's condition.
  const showSearchBar = useMemo(() => initialOptions.length > 5, [initialOptions.length])

  return (
    <div className="space-y-3" onKeyDown={onKeyDown}>
      <span className="block font-semibold">Filter by value</span>
      {showSearchBar && (
        <SearchInput
          value={defaultKeyword}
          onChange={handleKeywordChange}
          onClear={handleClearSearch}
        />
      )}
      <OptionsList
        options={filteredOptions}
        selectedValue={selectedRadio}
        onSelect={onSelectRadio}
      />
    </div>
  )
})

ColumnOptions.displayName = 'ColumnOptions'

export default ColumnOptions
