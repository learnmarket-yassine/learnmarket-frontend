import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useStore } from '@/store/store'
import { AvailabilityFormData, availabilitySchema } from '../../schemas'
import EditButton from './EditButton'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

type AvailabilityFormProps = {
  edit: boolean
  id?: string
  isLoading?: boolean
}

function AvailabilityForm(props: AvailabilityFormProps) {
  const [isOpen, setIsOpen] = useState(false)

  const tutorProfile = useStore((state) => state.myProfile.tutorProfile)

  const form = useForm<AvailabilityFormData>({
    resolver: zodResolver(availabilitySchema),
  })

  const { handleSubmit, reset } = form

  useEffect(() => {
    if (props.edit) {
      reset({
        hoursPerWeek: tutorProfile?.hoursPerWeek ?? '0',
      })
    } else reset()
  }, [props.edit, isOpen, reset, tutorProfile])

  const onSubmit: SubmitHandler<AvailabilityFormData> = async (data) => {
    if (props.edit) {
      //TODO: call the edit mutation
      console.warn('edit', data.hoursPerWeek)
    } else {
      //Todo: call the create mutation
      console.warn('create', data.hoursPerWeek)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {props.edit ? (
            <EditButton label="edit availability" />
          ) : (
            <Button type="button" onClick={() => setIsOpen(true)}>
              create
            </Button>
          )}
        </DialogTrigger>
        <DialogContent
          className="flex h-[450px] w-[400px] flex-col space-y-6 sm:w-[425px] sm:min-w-[750px]"
          style={{
            boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
          }}
        >
          <DialogHeader className="space-y-8">
            <DialogTitle>
              <div className="flex w-full items-center justify-between">
                <span className="text-4xl font-bold text-[#143681]">Availability</span>
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
            <DialogDescription className="space-y-2">
              <h1 className="text-xl font-bold text-[#5E5E5E]">Hours per week</h1>
              <p className="text-base text-[#5E5E5E]">
                Let learners know how many hours you're available to teach each week.
              </p>
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-1 flex-col overflow-hidden"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(onSubmit)(e)
            }}
            noValidate
          >
            <div className="flex-1 space-y-5 overflow-y-auto">
              <h2 className="text-lg text-[#5E5E5E]">I'm available to teach</h2>
              <Controller
                control={form.control}
                name="hoursPerWeek"
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val)
                    }}
                    className="w-fit gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="30+" id="r1" />
                      <Label htmlFor="r1" className="text-base text-[#5E5E5E]">
                        More than 30 hrs/week
                      </Label>
                    </div>

                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="10-30" id="r2" />
                      <Label htmlFor="r2" className="text-base text-[#5E5E5E]">
                        10-30 hrs/week
                      </Label>
                    </div>

                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="0-10" id="r3" />
                      <Label htmlFor="r3" className="text-base text-[#5E5E5E]">
                        Less than 10 hrs/week
                      </Label>
                    </div>

                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="0" id="r4" />
                      <Label htmlFor="r4" className="text-base text-[#5E5E5E]">
                        None
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
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

export default AvailabilityForm
