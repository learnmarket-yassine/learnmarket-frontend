import { useState, useMemo, useCallback } from 'react'
import { FilterOption } from '../types'

export const useFilterOptions = (initialOptions: FilterOption[]) => {
  const [keyword, setKeyword] = useState('')

  const filteredOptions = useMemo(() => {
    if (!keyword) return initialOptions
    return initialOptions.filter((option) =>
      option.name.toLowerCase().includes(keyword.toLowerCase())
    )
  }, [initialOptions, keyword])

  const handleSearch = useCallback((value: string) => {
    setKeyword(value)
  }, [])

  const clearSearch = useCallback(() => {
    setKeyword('')
  }, [])

  return {
    keyword,
    filteredOptions,
    handleSearch,
    clearSearch,
  }
}
