import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import {
  LanguageLevel,
  ProficiencySelect,
} from '@/features/myProfile/components/ui/ProficiencySelect'
import DeleteButton from '@/features/myProfile/components/ui/DeleteButton'
import ConfirmModal from '@/components/layout/ConfirmModal'
import { LANGUAGES, PROFICIENCY_LEVELS } from '@/lib/Constants'
import { useStore } from '@/store/store'
import { EditLanguagesFormData, EditLanguagesSchema } from '@/features/myProfile/schemas'
import useCreateLanguage from '@/features/myProfile/hooks/useCreateLanguages'
import useEditLanguage from '@/features/myProfile/hooks/useEditLanguage'
import useDeleteLanguage from '@/features/myProfile/hooks/useDeleteLanguage'
import PlusIcon from '@/assets/PlusIcon'
import { StepHandle } from '../../ui/StepperButtons'

type LanguagesStepProps = {
  onValidityChange?: (isValid: boolean) => void
  title?: string
  description?: string
}

const LanguagesStep = forwardRef<StepHandle, LanguagesStepProps>(
  (
    {
      onValidityChange,
      title = 'Looking good. Next, tell us which languages you speak.',
      description = 'Yora is global, so clients are often interested to know what languages you speak. English is a must, but do you speak any other languages?',
    },
    ref
  ) => {
    const user = useStore((state) => state.auth.user)
    const setUser = useStore((state) => state.auth.setUser)
    const { mutateAsync: createLanguageMutate } = useCreateLanguage()
    const { mutateAsync: editLanguageMutate } = useEditLanguage()
    const { handleDeleteLanguage, isPending: deleteLoading } = useDeleteLanguage()

    const form = useForm<EditLanguagesFormData>({
      resolver: zodResolver(EditLanguagesSchema),
      mode: 'onChange',
      defaultValues: {
        languages: user?.languages ?? [],
      },
    })

    const { handleSubmit, control, formState } = form
    const { isValid } = formState
    const { fields, append, remove } = useFieldArray({
      control,
      name: 'languages',
      keyName: 'fieldId',
    })

    useEffect(() => {
      onValidityChange?.(isValid)
    }, [isValid, onValidityChange])

    useImperativeHandle(ref, () => ({
      submit: async () => {
        let succeeded = false
        await handleSubmit(async (data) => {
          await Promise.all([
            ...data.languages
              .filter((row) => !row.id)
              .map((row) => createLanguageMutate({ language: row.language, level: row.level })),
            ...data.languages
              .filter((row) => !!row.id)
              .map((row) =>
                editLanguageMutate({
                  id: row.id as string,
                  payload: { language: row.language, level: row.level },
                })
              ),
          ])
          succeeded = true
        })()
        return succeeded
      },
    }))

    return (
      <div className="space-y-10">
        <div className="space-y-6">
          <h1 className="max-w-[520px] text-4xl font-bold text-[#1E293B]">{title}</h1>
          <p className="max-w-[420px] text-sm text-[#4B5563]">{description}</p>
        </div>
        <div className="flex flex-col space-y-6">
          <div className="space-y-5">
            {fields.map((field, index) => (
              <div key={field.fieldId} className="grid grid-cols-[1fr_1fr_auto] items-center gap-4">
                <Controller
                  control={control}
                  name={`languages.${index}.language`}
                  render={({ field: controllerField, fieldState }) => (
                    <div className="flex flex-col gap-2">
                      <Label>Language</Label>
                      <SearchableSelect
                        value={controllerField.value || undefined}
                        onValueChange={controllerField.onChange}
                        options={LANGUAGES}
                        placeholder="Search language"
                        error={!!fieldState.error}
                      />
                      {fieldState.error && (
                        <p className="text-xs text-red-600">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name={`languages.${index}.level`}
                  render={({ field: controllerField, fieldState }) => (
                    <div className="flex flex-col gap-2">
                      <Label>Proficiency</Label>
                      <ProficiencySelect
                        value={controllerField.value as LanguageLevel}
                        onChange={(value) => controllerField.onChange(value.value)}
                        options={PROFICIENCY_LEVELS}
                        placeholder="Select level"
                        error={!!fieldState.error}
                      />
                      {fieldState.error && (
                        <p className="text-xs text-red-600">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
                <div className="flex flex-col gap-2">
                  <Label className="invisible">Delete</Label>
                  {field.id ? (
                    <ConfirmModal
                      name="language"
                      type="delete"
                      title="Delete language"
                      description="Are you sure you want to delete this language ?"
                      handleConfirm={async () => {
                        await handleDeleteLanguage(field.id as string)
                        remove(index)
                        if (user) {
                          setUser({
                            ...user,
                            languages: user.languages.filter((lang) => lang.id !== field.id),
                          })
                        }
                      }}
                      buttonClassName="border-none"
                      isLoading={deleteLoading}
                    />
                  ) : (
                    <DeleteButton
                      label="remove language"
                      onClick={() => remove(index)}
                      className="flex rounded-full"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div>
            <Button
              type="button"
              variant={'outline'}
              onClick={() => append({ language: '', level: '' as LanguageLevel })}
              className="flex h-full items-center gap-3 rounded-full border border-[#004AC6] px-8 py-3 text-base text-[#004AC6] hover:text-[#004AC6]"
            >
              <PlusIcon className="size-4" />
              Add a language
            </Button>
          </div>
        </div>
      </div>
    )
  }
)

LanguagesStep.displayName = 'LanguagesStep'

export default LanguagesStep
