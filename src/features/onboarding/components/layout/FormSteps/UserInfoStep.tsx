import { CalendarIcon, PlusIcon } from 'lucide-react'
import UploadImageForm from '../../ui/UploadImageModal'
import UserRoundIcon from '@/assets/UserRoundIcon'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserFormData, userSchema } from '@/features/onboarding/schemas'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CountryDropdown } from '@/components/ui/CountryDropdown'
import { CustomInput } from '@/components/ui/CustomInput'

const UserInfoStep = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false)

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      countryCode: 'FR',
    },
  })
  const { register, formState, handleSubmit, setValue, reset } = form
  const { errors, isSubmitted } = formState
  return (
    <div className="space-y-6">
      <h1 className="max-w-[540px] text-4xl font-bold text-[#1E293B]">
        A few last details, then you can check and publish your profile.
      </h1>
      <p className="max-w-[600px] text-sm text-[#4B5563]">
        A professional photo helps you build trust with your clients. To keep things safe and
        simple, they'll pay you through us - which is why we need your personal information.
      </p>
      <div className="flex items-start gap-12">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative flex h-32 w-32 items-center rounded-full bg-[#E5E7EB]">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <UserRoundIcon className="size-20" />
            </div>
            <div className="absolute right-1 top-3/4 flex h-7 w-7 items-center rounded-full border border-white bg-[#10A310]">
              <PlusIcon className="size-8 text-white" />
            </div>
          </div>
          <UploadImageForm />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-[#1F2937]">Date of Birth *</Label>
            <Popover open={isStartCalendarOpen} onOpenChange={setIsStartCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  className="h-12 min-w-[560px] rounded-full border border-[#D1D5DB] bg-white text-[#6B7280]"
                  variant={'outline'}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="center" className="w-full">
                <Calendar
                  mode="single"
                  disabled={(date) => date > new Date()}
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <CountryDropdown required placeholder="Tunisia" label="Country" />
          </div>
          <div className="w-full">
            <Label htmlFor="street" className="text-sm font-bold text-[#1F2937]">
              Street address *
            </Label>
            <CustomInput
              type="text"
              id="street"
              placeholder="Enter street address"
              className="rounded-full border border-[#D1D5DB] bg-white"
              width="w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-full">
              <Label htmlFor="city" className="text-sm font-bold text-[#1F2937]">
                City *
              </Label>
              <CustomInput
                type="text"
                id="city"
                placeholder="Enter city"
                className="rounded-full border border-[#D1D5DB] bg-white"
                width="w-full"
              />
            </div>
            <div className="w-full">
              <Label htmlFor="state" className="text-sm font-bold text-[#1F2937]">
                State/province
              </Label>
              <CustomInput
                type="text"
                id="state"
                placeholder="Enter state/province"
                className="rounded-full border border-[#D1D5DB] bg-white"
                width="w-full"
              />
            </div>
            <div className="w-full">
              <Label htmlFor="zip" className="text-sm font-bold text-[#1F2937]">
                ZIP/Postal code
              </Label>
              <CustomInput
                type="text"
                id="street"
                placeholder="Enter ZIP/Postal code"
                className="rounded-full border border-[#D1D5DB] bg-white"
                width="w-full"
              />
            </div>
          </div>

          <PhoneInput
            id="phone"
            {...register('phone')}
            error={
              isSubmitted && phoneNumber.length === 0
                ? 'Phone number required'
                : errors.phone?.message
            }
            required
            label={'Phone'}
            placeholder="800 2738 9700"
            value={phoneNumber}
            defaultCountry="FR"
            isEdit={true}
            onChange={(value) => {
              setPhoneNumber(value)
              setValue('phone', value)
            }}
            onCountryChange={(country) => {
              setValue('countryCode', country ?? 'FR')
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default UserInfoStep
