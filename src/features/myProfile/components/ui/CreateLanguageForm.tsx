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
import LanguageSelect from '@/components/ui/LanguageDropdown'
import ProficiencySelect from './ProficiencySelect'

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
          className="flex h-[500px] w-[400px] flex-col space-y-6 sm:w-[425px] sm:min-w-[750px]"
          style={{
            boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
          }}
        >
          <DialogHeader>
            <DialogTitle className="mb-[20px] text-2xl font-[600] text-[#4C4C4C]">
              <div className="flex w-full items-center justify-between">
                <span className="text-2xl font-semibold text-[#143681]">Add language</span>
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
                      <Label className="text-base font-semibold">Language</Label>
                      <LanguageSelect
                        placeholder="Search for language"
                        defaultValue={field.value}
                        onChange={(selected) => field.onChange(selected.value)}
                        options={LANGUAGES}
                      />
                      {fieldState.error && (
                        <p className="text-xs text-destructive">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name="level"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-2">
                      <Label className="text-base font-semibold">Proficiency level</Label>
                      <ProficiencySelect
                        placeholder="Search for proficiency level"
                        defaultValue={field.value}
                        onChange={(selected) => field.onChange(selected.value)}
                        options={PROFICIENCY_LEVELS}
                        error={!!fieldState.error}
                      />
                      {fieldState.error && (
                        <p className="text-xs text-destructive">{fieldState.error.message}</p>
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
                className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                data-mdb-button-init
                data-mdb-ripple-init
                className="h-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-medium text-white hover:bg-[#2563EB]"
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
