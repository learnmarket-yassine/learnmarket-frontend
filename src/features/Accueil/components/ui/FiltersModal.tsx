import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import useCategories from '@/hooks/useCategories'
import { LANGUAGES } from '@/lib/Constants'
import {
  learnRequestFiltersSchema,
  LearnRequestFiltersValues,
} from '@/features/learn-requests/schemas'
import { LEVEL_LABELS, TYPE_LABELS } from '@/features/learn-requests/constants/labels'
import { LearnRequestType, ProficiencyLevel } from '@/features/learn-requests/store/types'

const DEFAULT_FILTERS: LearnRequestFiltersValues = {
  type: [],
  level: [],
  preferredLanguages: [],
  requestedFrequency: [],
}

const TYPE_OPTIONS: LearnRequestType[] = ['ONE_TIME', 'COURSE']
const LEVEL_OPTIONS: ProficiencyLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']
const FREQUENCY_OPTIONS = [1, 2, 3, 4, 5, 6]

function countActiveFilters(filters: LearnRequestFiltersValues): number {
  return (
    (filters.categoryId ? 1 : 0) +
    (filters.type?.length ?? 0) +
    (filters.level?.length ?? 0) +
    (filters.budgetMin !== undefined || filters.budgetMax !== undefined ? 1 : 0) +
    (filters.preferredLanguages?.length ?? 0) +
    (filters.requestedFrequency?.length ?? 0)
  )
}

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

interface FiltersModalProps {
  value: LearnRequestFiltersValues
  onApply: (filters: LearnRequestFiltersValues) => void
}

function FiltersModal({ value, onApply }: FiltersModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const activeFilterCount = countActiveFilters(value)

  const { categories } = useCategories()
  const categoryOptions = useMemo(
    () => [
      { value: '', label: 'Any category' },
      ...categories.map((category) => ({ value: category.id, label: category.name })),
    ],
    [categories]
  )
  const languageLabel = (lang: string) =>
    LANGUAGES.find((option) => option.value === lang)?.label ?? lang

  const { control, register, handleSubmit, reset, setValue, formState } =
    useForm<LearnRequestFiltersValues>({
      resolver: zodResolver(learnRequestFiltersSchema),
      defaultValues: { ...DEFAULT_FILTERS, ...value },
    })
  const { errors } = formState
  const draft = useWatch({ control })

  useEffect(() => {
    if (isOpen) reset({ ...DEFAULT_FILTERS, ...value })
  }, [isOpen, value, reset])

  useEffect(() => {
    if (!draft.type?.includes('COURSE') && draft.requestedFrequency?.length) {
      setValue('requestedFrequency', [], { shouldValidate: true })
    }
  }, [draft.type, draft.requestedFrequency, setValue])

  const handleClear = () => {
    reset(DEFAULT_FILTERS)
    onApply(DEFAULT_FILTERS)
    setIsOpen(false)
  }

  const onSubmit = (data: LearnRequestFiltersValues) => {
    onApply(data)
    setIsOpen(false)
  }

  const chips: { key: string; label: string; onRemove: () => void }[] = []
  if (draft.categoryId) {
    const category = categories.find((c) => c.id === draft.categoryId)
    chips.push({
      key: 'category',
      label: category?.name ?? 'Category',
      onRemove: () => setValue('categoryId', undefined),
    })
  }
  draft.type?.forEach((type) =>
    chips.push({
      key: `type-${type}`,
      label: TYPE_LABELS[type],
      onRemove: () => setValue('type', toggleValue(draft.type ?? [], type)),
    })
  )
  draft.level?.forEach((level) =>
    chips.push({
      key: `level-${level}`,
      label: LEVEL_LABELS[level],
      onRemove: () => setValue('level', toggleValue(draft.level ?? [], level)),
    })
  )
  if (draft.budgetMin !== undefined || draft.budgetMax !== undefined) {
    chips.push({
      key: 'budget',
      label: `Budget: $${draft.budgetMin ?? 0} - $${draft.budgetMax ?? '∞'}`,
      onRemove: () => {
        setValue('budgetMin', undefined)
        setValue('budgetMax', undefined)
      },
    })
  }
  draft.preferredLanguages?.forEach((lang) =>
    chips.push({
      key: `lang-${lang}`,
      label: languageLabel(lang),
      onRemove: () =>
        setValue(
          'preferredLanguages',
          (draft.preferredLanguages ?? []).filter((l) => l !== lang)
        ),
    })
  )
  draft.requestedFrequency?.forEach((freq) =>
    chips.push({
      key: `freq-${freq}`,
      label: `${freq} session${freq > 1 ? 's' : ''}/week`,
      onRemove: () =>
        setValue(
          'requestedFrequency',
          (draft.requestedFrequency ?? []).filter((f) => f !== freq)
        ),
    })
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={'outline'}
          className="relative flex h-full items-center gap-3 whitespace-nowrap rounded-full bg-white px-6 py-3 font-semibold text-[#2563EB] hover:bg-white hover:text-[#2563EB]"
        >
          <SlidersHorizontal className="size-5" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="h-5 w-5 rounded-full bg-[#2563EB] text-white">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="flex h-[560px] min-w-[592px] flex-col space-y-6"
        style={{
          boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
        }}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex w-full items-center justify-between">
              <span className="text-4xl font-bold text-[#143681]">Filters</span>
              <button type="button" onClick={() => setIsOpen(false)}>
                <X className="size-9" />
              </button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b border-[#E0E2E6] pb-4">
            {chips.map((chip) => (
              <span
                key={chip.key}
                className="flex items-center gap-1 rounded-full bg-[#143681] px-3 py-1 text-sm text-white"
              >
                {chip.label}
                <button
                  type="button"
                  onClick={chip.onRemove}
                  aria-label={`Remove ${chip.label}`}
                  className="transition"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        <form
          className="flex flex-1 flex-col overflow-hidden"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="flex-1 space-y-6 overflow-y-auto px-6">
            <div className="space-y-2">
              <Label htmlFor="categoryId" className="text-sm font-semibold text-[#143681]">
                Category
              </Label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <SearchableSelect
                    options={categoryOptions}
                    value={field.value ?? ''}
                    onValueChange={(v) => field.onChange(v || undefined)}
                    placeholder="Any category"
                  />
                )}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-semibold text-[#143681]">Format</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <div className="space-y-4">
                    {TYPE_OPTIONS.map((type) => (
                      <label key={type} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={(field.value ?? []).includes(type)}
                          onCheckedChange={() =>
                            field.onChange(toggleValue(field.value ?? [], type))
                          }
                        />
                        {TYPE_LABELS[type]}
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-semibold text-[#143681]">Level</Label>
              <Controller
                control={control}
                name="level"
                render={({ field }) => (
                  <div className="space-y-4">
                    {LEVEL_OPTIONS.map((level) => (
                      <label key={level} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={(field.value ?? []).includes(level)}
                          onCheckedChange={() =>
                            field.onChange(toggleValue(field.value ?? [], level))
                          }
                        />
                        {LEVEL_LABELS[level]}
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-semibold text-[#143681]">Budget</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Min"
                    {...register('budgetMin', {
                      setValueAs: (v) => (v === '' ? undefined : Number(v)),
                    })}
                  />
                  {errors.budgetMin && (
                    <p className="mt-1 text-xs text-red-600">{errors.budgetMin.message}</p>
                  )}
                </div>
                <div>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Max"
                    {...register('budgetMax', {
                      setValueAs: (v) => (v === '' ? undefined : Number(v)),
                    })}
                  />
                  {errors.budgetMax && (
                    <p className="mt-1 text-xs text-red-600">{errors.budgetMax.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-semibold text-[#143681]">Preferred languages</Label>
              <Controller
                control={control}
                name="preferredLanguages"
                render={({ field }) => {
                  const languageOptions = LANGUAGES.filter(
                    (opt) => !(field.value ?? []).includes(opt.value)
                  )
                  return (
                    <SearchableSelect
                      value=""
                      onValueChange={(lang) => {
                        if (!(field.value ?? []).includes(lang)) {
                          field.onChange([...(field.value ?? []), lang])
                        }
                      }}
                      options={languageOptions}
                      placeholder="Add a language"
                    />
                  )
                }}
              />
            </div>

            {draft.type?.includes('COURSE') && (
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-[#143681]">
                  Sessions per week (course)
                </Label>
                <Controller
                  control={control}
                  name="requestedFrequency"
                  render={({ field }) => (
                    <div className="space-y-4">
                      {FREQUENCY_OPTIONS.map((freq) => (
                        <label key={freq} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={(field.value ?? []).includes(freq)}
                            onCheckedChange={() =>
                              field.onChange(toggleValue(field.value ?? [], freq))
                            }
                          />
                          {freq}
                        </label>
                      ))}
                    </div>
                  )}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
              onClick={handleClear}
            >
              Clear
            </Button>

            <Button
              type="submit"
              className="flex h-full items-center gap-3 whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#2563EB]"
            >
              Apply{' '}
              {activeFilterCount > 0 && (
                <span className="text-white">{`(${activeFilterCount})`}</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default FiltersModal
