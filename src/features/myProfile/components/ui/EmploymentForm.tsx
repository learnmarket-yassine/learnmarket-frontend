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
import { CalendarIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useStore } from '@/store/store'
import { EmploymentFormData, employmentSchema } from '../../schemas'
import EditButton from './EditButton'
import { CustomInput } from '@/components/ui/CustomInput'
import AddButton from './AddButton'
import { Textarea } from '@/components/ui/textarea'
import useEditEmployment from '../../hooks/useEditEmployment'
import useCreateEmployment from '../../hooks/useCreateEmployment'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'

type EducationFormProps = {
  edit: boolean
  id?: string
}

function EmploymentForm(props: EducationFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false)
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false)

  const { mutate: editEmploymentMutation, isPending: editLoading } = useEditEmployment()
  const { mutate: createEmploymentMutation, isPending: createLoading } = useCreateEmployment()

  const user = useStore((state) => state.auth.user)

  const selectedEmployment = (user?.tutorProfile?.employment ?? []).find(
    (employment) => employment.id === props.id
  )

  const form = useForm<EmploymentFormData>({
    resolver: zodResolver(employmentSchema),
    defaultValues: {
      company: '',
      jobTitle: '',
      description: '',
      country: '',
      city: '',
      current: false,
    },
  })

  const { handleSubmit, reset, formState, register, control } = form
  const { errors } = formState
  useEffect(() => {
    if (props.edit) {
      reset({
        company: selectedEmployment?.company ?? '',
        jobTitle: selectedEmployment?.jobTitle ?? '',
        description: selectedEmployment?.description ?? '',
        country: selectedEmployment?.country ?? '',
        city: selectedEmployment?.city ?? '',
        startDate: selectedEmployment?.startDate
          ? new Date(selectedEmployment.startDate)
          : undefined,
        endDate: selectedEmployment?.endDate ? new Date(selectedEmployment.endDate) : undefined,
        current: selectedEmployment?.current,
      })
    } else reset()
  }, [props.edit, isOpen, reset, selectedEmployment])

  const onSubmit: SubmitHandler<EmploymentFormData> = async (data) => {
    if (props.edit && props.id) {
      //TODO: call the edit mutation
      editEmploymentMutation({ payload: data, id: props.id })
    } else {
      //Todo: call the create mutation
      createEmploymentMutation(data)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {props.edit ? (
            <EditButton label="edit employment" />
          ) : (
            <AddButton label="Add employment" />
          )}
        </DialogTrigger>
        <DialogContent
          className="flex min-h-[600px] w-[400px] flex-col sm:w-[425px] sm:min-w-[650px]"
          style={{
            boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
          }}
        >
          <DialogHeader>
            <DialogTitle>
              <div className="flex w-full items-center justify-between">
                <span className="text-4xl font-bold text-[#143681]">
                  {props.edit ? 'Edit employment' : 'Add employment'}
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
            className="flex flex-1 flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(onSubmit)(e)
            }}
            noValidate
          >
            <div className="flex-1 space-y-6 overflow-auto">
              <div>
                <Label htmlFor="company" className="text-sm font-semibold text-[#1F2937]">
                  Company {!props.edit && <span>*</span>}
                </Label>
                <CustomInput
                  type="text"
                  id="company"
                  placeholder="Ex: Sastec"
                  className="rounded-full border border-[#6B7280] bg-white"
                  width="w-full"
                  error={errors.company?.message}
                  {...register('company')}
                />
              </div>
              <div>
                <Label htmlFor="jobTitle" className="text-sm font-semibold text-[#1F2937]">
                  Job Title {!props.edit && <span>*</span>}
                </Label>
                <CustomInput
                  type="text"
                  id="jobTitle"
                  placeholder="Ex: Sastec"
                  className="rounded-full border border-[#6B7280] bg-white"
                  width="w-full"
                  error={errors.jobTitle?.message}
                  {...register('jobTitle')}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-full">
                  <Label htmlFor="city" className="text-sm font-semibold text-[#1F2937]">
                    City (Optional)
                  </Label>
                  <CustomInput
                    type="text"
                    id="city"
                    placeholder="Ex: Paris"
                    className="rounded-full border border-[#6B7280] bg-white"
                    width="w-full"
                    error={errors.city?.message}
                    {...register('city')}
                  />
                </div>
                <div className="w-full">
                  <Label htmlFor="country" className="text-sm font-semibold text-[#1F2937]">
                    Country (Optional)
                  </Label>
                  <CustomInput
                    type="text"
                    id="Country"
                    placeholder="Ex: France"
                    className="rounded-full border border-[#6B7280] bg-white"
                    width="w-full"
                    error={errors.country?.message}
                    {...register('country')}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="startDate" className="text-sm font-semibold text-[#1F2937]">
                    Start Date
                  </Label>
                  <Controller
                    name="startDate"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <Popover open={isStartCalendarOpen} onOpenChange={setIsStartCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            className="h-11 w-full rounded-full border border-[#6B7280] bg-white text-[#6B7280]"
                            variant={'outline'}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'PPP', { locale: fr })
                            ) : (
                              <span>Select start date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date)
                              setIsStartCalendarOpen(false)
                            }}
                            locale={fr}
                            disabled={(date) => date > new Date()}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-600">{errors.startDate?.message}</p>
                  )}
                </div>
                <Controller
                  name="endDate"
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => (
                    <div>
                      <Label htmlFor="endDate" className="text-sm font-semibold text-[#1F2937]">
                        End Date
                      </Label>
                      <Popover open={isEndCalendarOpen} onOpenChange={setIsEndCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            className="h-11 w-full rounded-full border border-[#6B7280] bg-white text-[#6B7280]"
                            variant={'outline'}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'PPP', { locale: fr })
                            ) : (
                              <span>Select end date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date)
                              setIsEndCalendarOpen(false)
                            }}
                            locale={fr}
                            disabled={(date) => date > new Date()}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.endDate && (
                        <p className="text-sm text-red-600">{errors.endDate?.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Controller
                  name="current"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="current"
                      checked={field.value}
                      onCheckedChange={(state) => field.onChange(!!state)}
                      className="h-5 w-5 cursor-pointer rounded-none border-[#6B7280]"
                    />
                  )}
                />
                <label htmlFor="current" className="cursor-pointer text-sm text-[#374151]">
                  I currently work here
                </label>
                {errors.current && (
                  <p className="text-sm text-red-600">{errors.current?.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-[#1F2937]">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Digital Marketing | Video Editing, Video Editing & Production, Logo"
                  className="h-[200px] resize-none rounded-xl border border-[#6B7280] bg-white p-4"
                  error={errors.description?.message}
                  {...register('description')}
                  maxLength={5000}
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
                disabled={createLoading || editLoading}
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

export default EmploymentForm
