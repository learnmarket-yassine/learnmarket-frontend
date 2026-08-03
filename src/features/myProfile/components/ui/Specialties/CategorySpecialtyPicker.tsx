import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils'
import { Specialty } from '@/types/category'
import useCategories from '@/hooks/useCategories'
import useSpecialtiesByCategory from '@/hooks/useSpecialtiesByCategory'
import LoadingRow from '../Skills/LoadingRow'
import CategoryListItem from './CategoryListItem'
import SpecialtyCheckboxOption from './SpecialtyCheckboxOption'
import SpecialtyPickerFooter from './SpecialtyPickerFooter'
import Loader from '@/components/ui/Loader/Loader'

interface CategorySpecialtyPickerProps {
  value: Specialty[]
  onChange: (specialties: Specialty[]) => void
  minSpecialties?: number
  maxSpecialties?: number
  error?: string
  className?: string
}

function CategorySpecialtyPicker({
  value = [],
  onChange,
  minSpecialties = 1,
  maxSpecialties = 5,
  error,
  className,
}: CategorySpecialtyPickerProps) {
  const {
    categories,
    isLoading,
    error: loadError,
    isFetchingNextPage: isFetchingMoreCategories,
    hasNextPage: hasMoreCategories,
    fetchNextPage: fetchMoreCategories,
  } = useCategories()

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    value[0]?.categoryId ?? null
  )

  useEffect(() => {
    if (selectedCategoryId) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedCategoryId(value[0]?.categoryId ?? categories[0]?.id ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, categories])

  const {
    specialties,
    isLoading: isLoadingSpecialties,
    error: specialtiesLoadError,
    isFetchingNextPage: isFetchingMoreSpecialties,
    hasNextPage: hasMoreSpecialties,
    fetchNextPage: fetchMoreSpecialties,
  } = useSpecialtiesByCategory(selectedCategoryId)

  const [categoryListRoot, setCategoryListRoot] = useState<HTMLUListElement | null>(null)
  const { ref: categorySentinelRef, inView: categorySentinelInView } = useInView({
    root: categoryListRoot,
  })

  useEffect(() => {
    if (categorySentinelInView && hasMoreCategories && !isFetchingMoreCategories) {
      fetchMoreCategories()
    }
  }, [categorySentinelInView, hasMoreCategories, isFetchingMoreCategories, fetchMoreCategories])

  const [specialtyListRoot, setSpecialtyListRoot] = useState<HTMLUListElement | null>(null)
  const { ref: specialtySentinelRef, inView: specialtySentinelInView } = useInView({
    root: specialtyListRoot,
  })

  useEffect(() => {
    if (specialtySentinelInView && hasMoreSpecialties && !isFetchingMoreSpecialties) {
      fetchMoreSpecialties()
    }
  }, [specialtySentinelInView, hasMoreSpecialties, isFetchingMoreSpecialties, fetchMoreSpecialties])

  const atLimit = value.length >= maxSpecialties

  const handleSelectCategory = (categoryId: string): void => {
    setSelectedCategoryId(categoryId)
  }

  const handleToggleSpecialty = (specialty: Specialty): void => {
    const isSelected = value.some((item) => item.id === specialty.id)
    if (isSelected) {
      onChange(value.filter((item) => item.id !== specialty.id))
    } else if (!atLimit) {
      onChange([...value, specialty])
    }
  }

  return (
    <div className={cn('flex w-full flex-col', className)}>
      <div className="grid h-full grid-cols-12 gap-8">
        <div className="col-span-4 flex flex-col gap-5">
          <p className="text-xs font-bold uppercase text-[#9CA3AF]">SELECT CATEGORY</p>
          <div className="flex flex-1 flex-col">
            {isLoading ? (
              <Loader className="flex h-full w-full items-center justify-center" />
            ) : loadError ? (
              <div className="flex flex-1 items-center">
                <p className="text-sm text-red-600" role="alert">
                  {loadError}
                </p>
              </div>
            ) : (
              <ul ref={setCategoryListRoot} className="max-h-[400px] space-y-2 overflow-auto">
                {categories.map((category) => (
                  <CategoryListItem
                    key={category.id}
                    category={category}
                    isActive={category.id === selectedCategoryId}
                    selectedCount={value.filter((item) => item.categoryId === category.id).length}
                    onSelect={handleSelectCategory}
                  />
                ))}
                <li ref={categorySentinelRef} aria-hidden="true" />
                {isFetchingMoreCategories && <LoadingRow label="Loading more..." size="sm" />}
              </ul>
            )}
          </div>
        </div>

        <div className="col-span-4 flex flex-col gap-5">
          <p className="text-xs font-bold uppercase text-[#9CA3AF]">
            Select {minSpecialties} to {maxSpecialties} specialties
          </p>
          {!selectedCategoryId ? (
            <div className="flex flex-1 items-center">
              <p className="text-sm text-[#5E5E5E]">Select a category to see its specialties</p>
            </div>
          ) : isLoadingSpecialties ? (
            <div className="flex flex-1 items-center">
              <Loader className="flex h-full w-full items-center justify-center" />
            </div>
          ) : specialtiesLoadError ? (
            <div className="flex flex-1 items-center">
              <p className="text-sm text-red-600" role="alert">
                {specialtiesLoadError}
              </p>
            </div>
          ) : (
            <ul ref={setSpecialtyListRoot} className="max-h-[400px] space-y-2 overflow-auto">
              {specialties.map((specialty) => (
                <SpecialtyCheckboxOption
                  key={specialty.id}
                  specialty={specialty}
                  checked={value.some((item) => item.id === specialty.id)}
                  disabled={atLimit && !value.some((item) => item.id === specialty.id)}
                  onToggle={handleToggleSpecialty}
                />
              ))}
              <li ref={specialtySentinelRef} aria-hidden="true" />
              {isFetchingMoreSpecialties && <LoadingRow label="Loading more..." size="sm" />}
            </ul>
          )}
        </div>
      </div>
      <SpecialtyPickerFooter
        value={value}
        maxSpecialties={maxSpecialties}
        atLimit={atLimit}
        error={error}
      />
    </div>
  )
}

export default CategorySpecialtyPicker
