import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
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
import { useStore } from '@/store/store'
import { EducationFormData, educationSchema } from '../../schemas'
import EditButton from './EditButton'
import { CustomInput } from '@/components/ui/CustomInput'
import AddButton from './AddButton'
import { SearchableSelect } from '@/components/ui/SearchableSelect'

type EducationFormProps = {
  edit: boolean
  id?: string
  isLoading?: boolean
}

function EducationForm(props: EducationFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const YEARS = Array.from({ length: new Date().getFullYear() - 1970 + 1 }, (_, i) => {
    const year = String(new Date().getFullYear() - i)
    return { label: year, value: year }
  })

  const tutorProfile = useStore((state) => state.myProfile.tutorProfile)

  const selectedEducation = tutorProfile?.education.find((education) => education.id === props.id)

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
  })

  const { handleSubmit, reset, formState, register } = form
  const { errors } = formState

  useEffect(() => {
    if (props.edit) {
      reset({
        institution: selectedEducation?.institution ?? '',
      })
    } else reset()
  }, [props.edit, isOpen, reset, selectedEducation])

  const onSubmit: SubmitHandler<EducationFormData> = async (data) => {
    if (props.edit) {
      //TODO: call the edit mutation
      console.warn('edit', data)
    } else {
      //Todo: call the create mutation
      console.warn('create', data)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {props.edit ? <EditButton label="edit education" /> : <AddButton label="Add education" />}
        </DialogTrigger>
        <DialogContent
          className="flex h-[500px] w-[400px] flex-col overflow-auto sm:w-[425px] sm:min-w-[750px]"
          style={{
            boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
          }}
        >
          <DialogHeader>
            <DialogTitle className="mb-[20px] text-2xl font-[600] text-[#4C4C4C]">
              <div className="flex w-full items-center justify-between">
                <span className="text-2xl font-semibold text-[#143681]">
                  {props.edit ? 'Edit education' : 'Add education'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false)
                  }}
                >
                  <X className="size-9" />
                </button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <form
            className="flex flex-1 flex-col"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(onSubmit)(e)
            }}
            noValidate
          >
            <div className="flex-1 space-y-5 overflow-auto">
              <div>
                <Label htmlFor="institution" className="text-base font-semibold">
                  School {!props.edit && <span>*</span>}
                </Label>
                <CustomInput
                  type="text"
                  id="institution"
                  placeholder="Ex: Northwestern University"
                  className="rounded-full border bg-white"
                  width="w-full"
                  error={errors.institution?.message}
                  {...register('institution')}
                />
              </div>
              <div className="space-y-3">
                <Label className="text-base font-semibold">Dates Attended (Optional)</Label>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Controller
                    control={form.control}
                    name="startYear"
                    render={({ field, fieldState }) => (
                      <div className="flex flex-col gap-1">
                        <SearchableSelect
                          placeholder="Select start year"
                          value={field.value ? String(field.value) : undefined}
                          onValueChange={(selected) => field.onChange(Number(selected))}
                          options={YEARS}
                          error={!!fieldState.error}
                        />
                        {fieldState.error && (
                          <p className="text-xs text-red-600">{fieldState.error.message}</p>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="endYear"
                    render={({ field, fieldState }) => (
                      <div className="flex flex-col gap-2">
                        <SearchableSelect
                          placeholder="Select end year"
                          value={field.value ? String(field.value) : undefined}
                          onValueChange={(selected) => field.onChange(Number(selected))}
                          options={YEARS}
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
              <div>
                <Label htmlFor="degree" className="text-base font-semibold">
                  Degree (Optional) {!props.edit && <span>*</span>}
                </Label>
                <CustomInput
                  type="text"
                  id="degree"
                  placeholder="Ex: Northwestern University"
                  className="rounded-full border bg-white"
                  width="w-full"
                  error={errors.degree?.message}
                  {...register('degree')}
                />
              </div>
              <div>
                <Label htmlFor="fieldOfStudy" className="text-base font-semibold">
                  Area of Study (Optional) {!props.edit && <span>*</span>}
                </Label>
                <CustomInput
                  type="text"
                  id="fieldOfStudy"
                  placeholder="Ex: Computer Science"
                  className="rounded-full border bg-white"
                  width="w-full"
                  error={errors.fieldOfStudy?.message}
                  {...register('fieldOfStudy')}
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

export default EducationForm
