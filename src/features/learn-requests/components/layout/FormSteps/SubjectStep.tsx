import { forwardRef, useMemo, useState } from 'react'
import { PlusIcon, TrendingUp } from 'lucide-react'
import { Controller } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Skill } from '@/types/skill'
import useCategories from '@/hooks/useCategories'
import useGetCategorySkills from '@/hooks/useGetCategorySkills'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { Label } from '@/components/ui/label'
import SkillsInput from '@/features/myProfile/components/ui/Skills/SkillsInput'
import SkillChip from '@/features/myProfile/components/ui/Skills/SkillChip'
import { CategorySkillsFormData, categorySkillsSchema } from '@/features/learn-requests/schemas'
import { StepHandle } from '@/features/learn-requests/store/types'
import { useDraftStepForm } from '@/features/learn-requests/hooks/useDraftStepForm'

const MAX_SKILLS = 10

type SubjectStepProps = {
  draftId: string
  defaultCategoryId: string | null
  defaultSkills: Skill[]
  onValidityChange: (isValid: boolean) => void
}

const SubjectStep = forwardRef<StepHandle, SubjectStepProps>(
  ({ draftId, defaultCategoryId, defaultSkills, onValidityChange }, ref) => {
    const [skills, setSkills] = useState<Skill[]>(defaultSkills)

    const { control, formState, setValue, watch } = useDraftStepForm<CategorySkillsFormData>({
      ref,
      schema: categorySkillsSchema,
      draftId,
      onValidityChange,
      defaultValues: {
        categoryId: defaultCategoryId ?? '',
        skillIds: defaultSkills.map((s) => s.id),
      },
      // Exposes the full Skill[] objects (not just skillIds) so the
      // orchestrator can seed this step's UI again if the user navigates back.
      toExposedValues: (values) => ({ ...values, skills }),
    })
    const { errors } = formState

    const categoryId = watch('categoryId')

    const { categories } = useCategories()
    const categoryOptions = useMemo(
      () => categories.map((category) => ({ value: category.id, label: category.name })),
      [categories]
    )
    const selectedCategory = categories.find((category) => category.id === categoryId)

    const categorySkillsQuery = useGetCategorySkills(categoryId || null)

    const selectedSkillIds = useMemo(() => new Set(skills.map((s) => s.id)), [skills])

    const suggestedSkills = useMemo(
      () => (categorySkillsQuery.data ?? []).filter((skill) => !selectedSkillIds.has(skill.id)),
      [categorySkillsQuery.data, selectedSkillIds]
    )

    const atLimit = skills.length >= MAX_SKILLS

    const updateSkills = (next: Skill[]) => {
      setSkills(next)
      setValue(
        'skillIds',
        next.map((s) => s.id),
        { shouldValidate: true, shouldDirty: true }
      )
    }

    const handleAddSuggestedSkill = (skill: Skill): void => {
      if (atLimit) return
      updateSkills([...skills, skill])
    }

    return (
      <div className="grid w-full grid-cols-5 gap-12">
        <div className="col-span-2 space-y-6">
          <h1 className="text-4xl font-bold text-[#143681]">What are you looking to learn?</h1>
          <p className="max-w-[400px] text-base text-[#6B7280]">
            Specify your goals and interests. This helps us match you with the perfect mentor and
            curate a specialized curriculum.
          </p>
        </div>
        <div className="col-span-3 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-semibold text-[#374151]">
              Category
            </Label>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <SearchableSelect
                  options={categoryOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select a category"
                  error={!!errors.categoryId}
                />
              )}
            />
          </div>
          <div className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="skills" className="text-sm font-semibold text-[#374151]">
                Skills
              </Label>
              <SkillsInput
                value={skills}
                onChange={updateSkills}
                maxSkills={MAX_SKILLS}
                error={errors.skillIds?.message}
              />
            </div>
            <div className="space-y-8">
              {skills.length > 0 && (
                <div className="space-y-4">
                  <p className="text-sm font-medium">Selected skills</p>
                  <div className="flex max-h-[250px] flex-wrap gap-2 overflow-auto rounded-lg border border-[#E0E2E6] p-3">
                    {skills.map((skill) => (
                      <SkillChip
                        key={skill.id}
                        name={skill.name}
                        id={skill.id}
                        onRemove={(id) => updateSkills(skills.filter((s) => s.id !== id))}
                      />
                    ))}
                  </div>
                </div>
              )}
              {categoryId && suggestedSkills.length > 0 && (
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-sm font-bold tracking-wide">
                    <TrendingUp className="size-4" />
                    Popular skills in {selectedCategory?.name}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSkills.map((skill) => (
                      <button
                        key={skill.id}
                        type="button"
                        disabled={atLimit}
                        onClick={() => handleAddSuggestedSkill(skill)}
                        className={cn(
                          'flex items-center gap-1 rounded-full border px-3 py-1 text-sm',
                          'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent'
                        )}
                      >
                        <PlusIcon className="size-3" />
                        {skill.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
)

SubjectStep.displayName = 'SubjectStep'

export default SubjectStep
