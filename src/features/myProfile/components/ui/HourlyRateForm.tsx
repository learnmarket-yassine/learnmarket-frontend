import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
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
import { HourlyRateFormData, hourlyRateSchema } from '../../schemas'
import EditButton from './EditButton'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import useEditTutorProfile from '../../hooks/useEditTutorProfile'

function HourlyRateForm() {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: editTutorProfileMutation, isPending } = useEditTutorProfile()
  const user = useStore((state) => state.auth.user)
  const form = useForm<HourlyRateFormData>({
    resolver: zodResolver(hourlyRateSchema),
  })

  const { register, handleSubmit, formState, reset, watch } = form
  const { errors } = formState
  const hourlyRate = Number(watch('hourlyRate') || 0)
  const serviceFee = 1.5
  const youReceive = Math.max(hourlyRate - serviceFee, 0)

  useEffect(() => {
    reset({
      hourlyRate: user?.tutorProfile?.hourlyRate ?? 0,
    })
  }, [isOpen, reset, user])

  const onSubmit: SubmitHandler<HourlyRateFormData> = async (data) => {
    editTutorProfileMutation(data)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <EditButton label="edit overview" />
        </DialogTrigger>
        <DialogContent
          className="flex h-[550px] min-w-[750px] flex-col space-y-7"
          style={{
            boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
          }}
        >
          <DialogHeader className="space-y-5">
            <DialogTitle>
              <div className="flex w-full items-center justify-between">
                <span className="text-4xl font-bold text-[#143681]">Change hourly rate</span>
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
            <DialogDescription className="space-y-5 text-base text-[#5E5E5E]">
              <p>Please note that your new hourly rate will only apply to new contracts.</p>
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-1 flex-col"
            onSubmit={(e) => {
              e.stopPropagation()
              handleSubmit(onSubmit)(e)
            }}
            noValidate
          >
            <div className="flex flex-1 flex-col space-y-2">
              <h4 className="text-base text-[#5E5E5E]">Your profile rate:$15.00/hr</h4>
              <div className="divide-y-[1px] divide-[#8E949F]">
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-base font-bold text-[#143681]">
                      Hourly Rate *
                    </Label>
                    <p className="text-base text-[#5E5E5E]">Total amount the learner will see</p>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <InputGroup
                        className={`rounded-full border p-5 has-[[data-slot=input-group-control]:focus-visible]:border-[#D9D9D9] has-[[data-slot=input-group-control]:focus-visible]:ring-0 ${errors.hourlyRate ? 'border-red-600' : 'border-[#D9D9D9]'}`}
                      >
                        <InputGroupAddon>
                          <InputGroupText className="text-base font-medium text-[#1E1E1E]">
                            $
                          </InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                          type="number"
                          placeholder="0.00"
                          {...register('hourlyRate', { valueAsNumber: true })}
                          className="text-lg text-[#1E1E1E] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                      </InputGroup>
                      <span className="text-lg text-[#1E1E1E]">/hr</span>
                    </div>
                    {errors.hourlyRate && (
                      <p className="text-sm text-red-600">{errors.hourlyRate.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-base font-bold text-[#143681]">
                      YORA Service Fee
                    </Label>
                    <p className="text-base text-[#5E5E5E]">
                      Fees vary and are shown before contract acceptance
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <InputGroup className="rounded-full border border-[#D9D9D9] bg-[#E3E3E3] p-5 has-[[data-slot=input-group-control]:focus-visible]:border-[#D9D9D9] has-[[data-slot=input-group-control]:focus-visible]:ring-0">
                      <InputGroupAddon>
                        <InputGroupText className="text-base font-medium text-[#1E1E1E]">
                          $
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        type="number"
                        value={serviceFee.toFixed(2)}
                        readOnly
                        placeholder="0.00"
                        className="text-lg text-[#1E1E1E] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    </InputGroup>
                    <span className="text-lg text-[#1E1E1E]">/hr</span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-base font-bold text-[#143681]">
                      You'll Receive
                    </Label>
                    <p className="text-base text-[#5E5E5E]">
                      The estimated amount you'll receive after service fees
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <InputGroup className="rounded-full border border-[#D9D9D9] p-5 has-[[data-slot=input-group-control]:focus-visible]:border-[#D9D9D9] has-[[data-slot=input-group-control]:focus-visible]:ring-0">
                      <InputGroupAddon>
                        <InputGroupText className="text-base font-medium text-[#1E1E1E]">
                          $
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        value={youReceive.toFixed(2)}
                        readOnly
                        type="number"
                        placeholder="0.00"
                        className="text-lg text-[#1E1E1E] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    </InputGroup>
                    <span className="text-lg text-[#1E1E1E]">/hr</span>
                  </div>
                </div>
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
                disabled={isPending}
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

export default HourlyRateForm
