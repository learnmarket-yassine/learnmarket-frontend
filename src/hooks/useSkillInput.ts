import { ChangeEvent, KeyboardEvent, useCallback, useMemo, useState } from 'react'
import useSkillSearch from '@/hooks/useSkillSearch'
import { Skill } from '@/types/skill'

interface UseSkillsInputParams {
  value: Skill[]
  onChange: (skills: Skill[]) => void
  maxSkills?: number
}

function useSkillsInput({ value, onChange, maxSkills }: UseSkillsInputParams) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const { results, isLoading, isFetching } = useSkillSearch(query)

  const atLimit = maxSkills ? value.length >= maxSkills : false
  const selectedIds = useMemo(() => new Set(value.map((skill) => skill.id)), [value])
  const options = useMemo(
    () => results.filter((skill) => !selectedIds.has(skill.id)),
    [results, selectedIds]
  )
  const hasQuery = query.trim() !== ''
  const showDropdown = isOpen && !atLimit && hasQuery

  const openDropdown = useCallback((): void => setIsOpen(true), [])
  const closeDropdown = useCallback((): void => setIsOpen(false), [])

  const addSkill = useCallback(
    (skill: Skill): void => {
      if (atLimit || selectedIds.has(skill.id)) return
      onChange([...value, skill])
      setQuery('')
      setIsOpen(false)
    },
    [atLimit, selectedIds, onChange, value]
  )

  const removeSkill = useCallback(
    (skillId: string): void => {
      onChange(value.filter((skill) => skill.id !== skillId))
    },
    [onChange, value]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Backspace' && query === '' && value.length > 0) {
        removeSkill(value[value.length - 1].id)
      }
    },
    [query, value, removeSkill]
  )

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value)
    setIsOpen(true)
  }, [])

  return {
    query,
    options,
    isLoading,
    isFetching,
    atLimit,
    showDropdown,
    addSkill,
    removeSkill,
    handleKeyDown,
    handleInputChange,
    openDropdown,
    closeDropdown,
  }
}

export default useSkillsInput
