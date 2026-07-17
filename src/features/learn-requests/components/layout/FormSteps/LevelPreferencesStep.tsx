import { forwardRef, useEffect, useMemo } from 'react'
import { Droplet, GraduationCap, TrendingUp, X } from 'lucide-react'
import { Controller } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { RadioGroup } from '@/components/ui/radio-group'
import {
  LearnRequestType,
  ProficiencyLevel,
  StepHandle,
} from '@/features/learn-requests/store/types'
import LevelCard from '../../ui/LevelCard'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { LANGUAGES } from '@/lib/Constants'
import SessionFrequencyCard from '../../ui/SessionFrequencyCard'
import {
  LevelPreferencesFormData,
  makeLevelPreferencesSchema,
} from '@/features/learn-requests/schemas'
import { useDraftStepForm } from '@/features/learn-requests/hooks/useDraftStepForm'

type Level = {
  value: ProficiencyLevel
  label: string
  description: string
  icon: React.ReactNode
}

const LEVELS: Level[] = [
  {
    value: 'BEGINNER',
    label: 'Beginner',
    description: 'I am new to this topic.',
    icon: <Droplet className="h-7 w-7 text-[#143681]" />,
  },
  {
    value: 'INTERMEDIATE',
    label: 'Intermediate',
    description: 'I know the basics and core concepts.',
    icon: <TrendingUp className="h-7 w-7 text-[#143681]" />,
  },
  {
    value: 'ADVANCED',
    label: 'Advanced',
    description: 'I have substantial experience.',
    icon: <GraduationCap className="h-7 w-7 text-[#143681]" />,
  },
]

type LevelPreferencesStepProps = {
  draftId: string
  type: LearnRequestType | null
  defaultValues: {
    level: ProficiencyLevel | null
    preferredLanguages: string[]
    requestedFrequency: number | null
  }
  onValidityChange: (isValid: boolean) => void
}

const LevelPreferencesStep = forwardRef<StepHandle, LevelPreferencesStepProps>(
  ({ draftId, type, defaultValues, onValidityChange }, ref) => {
    const schema = useMemo(() => makeLevelPreferencesSchema(type), [type])

    const { control, formState, setValue } = useDraftStepForm<LevelPreferencesFormData>({
      ref,
      schema,
      draftId,
      onValidityChange,
      defaultValues: {
        level: defaultValues.level ?? undefined,
        preferredLanguages: defaultValues.preferredLanguages,
        requestedFrequency: defaultValues.requestedFrequency,
      },
    })
    const { errors } = formState

    // The frequency picker only renders for COURSE, so a ONE_TIME request
    // must never carry a leftover value (e.g. from switching back from
    // COURSE, or an existing draft that was COURSE before) — otherwise the
    // schema's "must be empty for one-time" rule fails with no UI to fix it.
    useEffect(() => {
      if (type !== 'COURSE') {
        setValue('requestedFrequency', null, { shouldValidate: true })
      }
    }, [type, setValue])

    return (
      <div className="grid w-full grid-cols-8">
        <div className="col-span-3 space-y-6">
          <h1 className="text-4xl font-bold text-[#143681]">
            Tell tutors about your learning preferences.
          </h1>
          <p className="text-base text-[#6B7280]">
            Share your current skill level and let tutors know how you prefer to learn. This
            information helps us match you with tutors who have the right expertise, teaching style,
            and availability to support your goals. Whether you're starting from scratch, improving
            existing skills, or looking for advanced guidance, your preferences help create a more
            personalized learning experience.
          </p>
        </div>
        <div className="col-span-3 col-start-5 space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-[#374151]">Your level</Label>
            <Controller
              control={control}
              name="level"
              render={({ field }) => (
                <RadioGroup
                  className="flex w-full gap-4"
                  value={field.value ?? ''}
                  onValueChange={(value) => field.onChange(value as ProficiencyLevel)}
                >
                  {LEVELS.map((level) => (
                    <LevelCard key={level.value} id={`r-${level.value}`} {...level} />
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-[#374151]">Preferred languages</Label>
            <Controller
              control={control}
              name="preferredLanguages"
              render={({ field }) => {
                const languageOptions = LANGUAGES.filter((opt) => !field.value.includes(opt.value))
                return (
                  <>
                    <SearchableSelect
                      value=""
                      onValueChange={(lang) => {
                        if (!field.value.includes(lang)) {
                          field.onChange([...field.value, lang])
                        }
                      }}
                      options={languageOptions}
                      placeholder="Add a language"
                      error={!!errors.preferredLanguages}
                    />
                    <div className="space-y-8">
                      {field.value.length > 0 && (
                        <div className="space-y-4">
                          <p className="text-sm font-medium">Selected skills</p>
                          <div className="flex max-h-[250px] flex-wrap gap-2 overflow-auto rounded-lg border border-[#E0E2E6] p-3">
                            {field.value.map((lang, index) => (
                              <span
                                key={index}
                                className="flex items-center gap-1 rounded-full border bg-[#143681] px-3 py-1 text-sm text-white"
                              >
                                {lang}
                                <button
                                  type="button"
                                  onClick={() =>
                                    field.onChange(field.value.filter((l) => l !== lang))
                                  }
                                  className="transition"
                                  aria-label={`Remove ${lang}`}
                                >
                                  <X size={12} />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )
              }}
            />
          </div>

          {type === 'COURSE' && (
            <div className="space-y-2">
              <Label htmlFor="requested-frequency" className="text-sm font-semibold text-[#374151]">
                Sessions per week
              </Label>
              <Controller
                control={control}
                name="requestedFrequency"
                render={({ field }) => (
                  <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: 6 }, (_, i) => i + 1).map((num) => (
                      <SessionFrequencyCard
                        key={num}
                        selected={field.value === num}
                        setSessionsPerWeek={field.onChange}
                        num={num}
                      />
                    ))}
                  </div>
                )}
              />
              {errors.requestedFrequency && (
                <p className="text-xs text-red-600">{errors.requestedFrequency.message}</p>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
)

LevelPreferencesStep.displayName = 'LevelPreferencesStep'

export default LevelPreferencesStep
