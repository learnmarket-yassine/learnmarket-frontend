import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
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
import { AddLanguageFormData, AddLanguageSchema } from '../../schemas'
import AddButton from './AddButton'
import { LANGUAGES, PROFICIENCY_LEVELS } from '@/lib/Constants'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { ProficiencySelect } from './ProficiencySelect'

function CreateLanguageForm() {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<AddLanguageFormData>({
    resolver: zodResolver(AddLanguageSchema),
  })

  const { handleSubmit, control } = form

  const onSubmit: SubmitHandler<AddLanguageFormData> = async (data) => {
    //Todo: call the create mutation
    console.warn('create', data)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <AddButton label="create language" />
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
                <span className="text-4xl font-bold text-[#143681]">Add language</span>
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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Controller
                  control={form.control}
                  name="language"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-2">
                      <Label className="text-base font-bold">Language</Label>
                      <SearchableSelect
                        placeholder="Search for language"
                        value={field.value ? field.value : undefined}
                        onValueChange={(selected) => field.onChange(selected)}
                        options={LANGUAGES}
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
                  name="level"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-2">
                      <Label className="text-base font-bold">Proficiency level</Label>
                      <ProficiencySelect
                        placeholder="Search for proficiency level"
                        value={field.value ? field.value : undefined}
                        onChange={(selected) => field.onChange(selected.value)}
                        options={PROFICIENCY_LEVELS}
                        error={!!fieldState.error}
                      />
                      {fieldState.error && (
                        <p className="text-xs text-red-600">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
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

export default CreateLanguageForm
