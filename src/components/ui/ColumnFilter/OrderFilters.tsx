import { FilterType } from '@/features/table-filters/store/types'
import { CommandItem } from '../command'
import { useEffect } from 'react'

type Props = {
  optionName: string
  filterType: FilterType
  selectedOption: string
  onSelectOption: (option: string) => void
  handleSubmitFilter: () => void
}

const OrderFilters = (props: Props) => {
  const { selectedOption, onSelectOption, handleSubmitFilter } = props

  const handleSelect = (option: string) => {
    onSelectOption(option)
  }
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && selectedOption) {
      handleSubmitFilter()
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedOption])

  return (
    <div>
      <CommandItem onSelect={() => handleSelect('asc')} defaultChecked={selectedOption === 'asc'}>
        Sort ascending
      </CommandItem>
      <CommandItem onSelect={() => handleSelect('desc')} defaultChecked={selectedOption === 'desc'}>
        Sort descending
      </CommandItem>
    </div>
  )
}

export default OrderFilters
