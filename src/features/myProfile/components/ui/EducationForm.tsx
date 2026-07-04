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
import useEditEducation from '../../hooks/useEditEducation'
import useCreateEducation from '../../hooks/useCreateEducation'

type EducationFormProps = {
  edit: boolean
  id?: string
}

function EducationForm(props: EducationFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: editEducationMutation, isPending: editLoading } = useEditEducation()
  const { mutate: createEducationMutation, isPending: createLoading } = useCreateEducation()
  const YEARS = Array.from({ length: new Date().getFullYear() - 1970 + 1 }, (_, i) => {
    const year = String(new Date().getFullYear() - i)
    return { label: year, value: year }
  })

  const user = useStore((state) => state.auth.user)

  const selectedEducation = (user?.tutorProfile?.education ?? []).find(
    (education) => education.id === props.id
  )

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
  })

  const { handleSubmit, reset, formState, register } = form
  const { errors } = formState

  useEffect(() => {
    if (props.edit) {
      reset({
        institution: selectedEducation?.institution ?? '',
        startYear: selectedEducation?.startYear,
        endYear: selectedEducation?.endYear,
        degree: selectedEducation?.degree,
        fieldOfStudy: selectedEducation?.fieldOfStudy,
      })
    } else reset()
  }, [props.edit, isOpen, reset, selectedEducation])

  const onSubmit: SubmitHandler<EducationFormData> = async (data) => {
    if (props.edit && props.id) {
      //TODO: call the edit mutation
      editEducationMutation({ payload: data, id: props.id })
    } else {
      //Todo: call the create mutation
      createEducationMutation(data)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {props.edit ? <EditButton label="edit education" /> : <AddButton label="Add education" />}
        </DialogTrigger>
        <DialogContent
          className="flex h-[500px] w-[400px] flex-col space-y-6 sm:w-[425px] sm:min-w-[600px]"
          style={{
            boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
          }}
        >
          <DialogHeader>
            <DialogTitle>
              <div className="flex w-full items-center justify-between">
                <span className="text-4xl font-bold text-[#143681]">
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
                <Label htmlFor="institution" className="text-sm font-semibold text-[#1F2937]">
                  School {!props.edit && <span>*</span>}
                </Label>
                <CustomInput
                  type="text"
                  id="institution"
                  placeholder="Ex: Northwestern University"
                  className="rounded-full border border-[#6B7280] bg-white"
                  width="w-full"
                  error={errors.institution?.message}
                  {...register('institution')}
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-[#1F2937]">
                  Dates Attended (Optional)
                </Label>
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
                <Label htmlFor="degree" className="text-sm font-semibold text-[#1F2937]">
                  Degree (Optional) {!props.edit && <span>*</span>}
                </Label>
                <CustomInput
                  type="text"
                  id="degree"
                  placeholder="Ex: Northwestern University"
                  className="rounded-full border border-[#6B7280] bg-white"
                  width="w-full"
                  error={errors.degree?.message}
                  {...register('degree')}
                />
              </div>
              <div>
                <Label htmlFor="fieldOfStudy" className="text-sm font-semibold text-[#1F2937]">
                  Area of Study (Optional) {!props.edit && <span>*</span>}
                </Label>
                <CustomInput
                  type="text"
                  id="fieldOfStudy"
                  placeholder="Ex: Computer Science"
                  className="rounded-full border border-[#6B7280] bg-white"
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
                disabled={editLoading || createLoading}
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
