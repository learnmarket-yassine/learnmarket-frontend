import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { EditLanguagesSchema, EditLanguagesFormData } from '../../schemas'
import { LANGUAGES, PROFICIENCY_LEVELS } from '@/lib/Constants'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { ProficiencySelect } from './ProficiencySelect'
import EditButton from './EditButton'
import DeleteButton from './DeleteButton'

function EditLanguagesForm() {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<EditLanguagesFormData>({
    resolver: zodResolver(EditLanguagesSchema),
    defaultValues: {
      languages: [
        {
          language: 'english',
          level: 'conversational',
        },
        {
          language: 'french',
          level: 'conversational',
        },
        {
          language: 'arabic',
          level: 'fluent',
        },
      ],
    },
  })

  const { handleSubmit, control } = form

  const { fields } = useFieldArray({
    control,
    name: 'languages',
  })

  const onSubmit: SubmitHandler<EditLanguagesFormData> = async (data) => {
    //Todo: call the create mutation
    console.warn('edit', data)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <EditButton label="edit languages" />
        </DialogTrigger>
        <DialogContent
          className="flex h-[480px] min-w-[592px] flex-col space-y-8"
          style={{
            boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
          }}
        >
          <DialogHeader>
            <DialogTitle>
              <div className="flex w-full items-center justify-between">
                <span className="text-4xl font-bold text-[#143681]">Edit languages</span>
                <button type="button" onClick={() => setIsOpen(false)}>
                  <X className="size-9" />
                </button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <form
            className="flex flex-1 flex-col overflow-hidden"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(onSubmit)(e)
            }}
            noValidate
          >
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] items-center gap-4">
                    <Controller
                      control={control}
                      name={`languages.${index}.language`}
                      render={({ field, fieldState }) => (
                        <div className="flex flex-col gap-2">
                          <Label>Language</Label>
                          <SearchableSelect
                            value={field.value}
                            onValueChange={field.onChange}
                            options={LANGUAGES}
                            placeholder="Search language"
                            error={!!fieldState.error}
                            disabled
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
                      render={({ field, fieldState }) => (
                        <div className="flex flex-col gap-2">
                          <Label>Proficiency</Label>

                          <ProficiencySelect
                            value={field.value}
                            onChange={(value) => field.onChange(value.value)}
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
                      <DeleteButton label="Delete" onClick={() => {}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                data-mdb-button-init
                data-mdb-ripple-init
                className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                data-mdb-button-init
                data-mdb-ripple-init
                className="h-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#2563EB]"
              >
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EditLanguagesForm
