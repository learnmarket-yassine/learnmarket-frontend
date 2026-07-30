import { FilterType } from '@/features/table-filters/store/types'

export type FilterOption = {
  id: number | string
  name: string
  value: string
}

export type OptionConfig = {
  [K in FilterType]?: {
    [key: string]: FilterOption[]
  }
}

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
}

export interface OptionsListProps {
  options: FilterOption[]
  selectedValue: string
  onSelect: (value: string) => void
}
