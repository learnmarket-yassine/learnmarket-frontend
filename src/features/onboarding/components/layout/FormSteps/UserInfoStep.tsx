import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { CalendarIcon, PlusIcon } from 'lucide-react'
import UploadImageForm from '../../ui/UploadImageModal'
import UserRoundIcon from '@/assets/UserRoundIcon'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserInfoFormData, userInfoSchema } from '@/features/onboarding/schemas'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CountryDropdown } from '@/components/ui/CountryDropdown'
import { CustomInput } from '@/components/ui/CustomInput'
import { useStore } from '@/store/store'
import useEditUserInfo from '@/features/myProfile/hooks/useEditUser'
import { format } from 'date-fns'
import { StepHandle } from '../../ui/StepperButtons'
import { getAssetUrl } from '@/lib/utils'

type UserInfoStepProps = {
  onValidityChange?: (isValid: boolean) => void
}

const UserInfoStep = forwardRef<StepHandle, UserInfoStepProps>(({ onValidityChange }, ref) => {
  const user = useStore((state) => state.auth.user)
  const avatarUrl = getAssetUrl(user?.avatar)
  const { mutateAsync: editUserMutation } = useEditUserInfo()
  const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false)

  const form = useForm<UserInfoFormData>({
    resolver: zodResolver(userInfoSchema),
    mode: 'onChange',
    defaultValues: {
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
      country: user?.country ?? '',
      address: user?.address ?? '',
      city: user?.city ?? '',
      state: user?.state ?? '',
      postalCode: user?.postalCode ?? '',
      phone: user?.phone ?? '',
      countryCode: user?.phoneCountryCode ?? 'FR',
    },
  })
  const { register, formState, handleSubmit, setValue, control, watch } = form
  const { errors, isValid } = formState
  const phoneValue = watch('phone')

  useEffect(() => {
    onValidityChange?.(isValid)
  }, [isValid, onValidityChange])

  useImperativeHandle(ref, () => ({
    submit: async () => {
      let succeeded = false
      await handleSubmit(async (data) => {
        await editUserMutation({
          dateOfBirth: data.dateOfBirth.toISOString(),
          country: data.country,
          address: data.address,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          phone: data.phone,
          phoneCountryCode: data.countryCode,
        })
        succeeded = true
      })()
      return succeeded
    },
  }))

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
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${user?.firstname} ${user?.lastname}`}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <UserRoundIcon className="size-20" />
              </div>
            )}
            <div className="absolute right-1 top-3/4 flex h-7 w-7 items-center rounded-full border border-white bg-[#10A310]">
              <PlusIcon className="size-8 text-white" />
            </div>
          </div>
          <UploadImageForm />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-[#1F2937]">Date of Birth *</Label>
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field }) => (
                <Popover open={isStartCalendarOpen} onOpenChange={setIsStartCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      className="h-12 min-w-[560px] rounded-full border border-[#D1D5DB] bg-white text-[#6B7280]"
                      variant={'outline'}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, 'PPP') : 'Select date of birth'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="center" className="w-full">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date)
                        setIsStartCalendarOpen(false)
                      }}
                      disabled={(date) => date > new Date()}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-600">{errors.dateOfBirth.message}</p>
            )}
          </div>
          <div>
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <CountryDropdown
                  required
                  placeholder="Tunisia"
                  label="Country"
                  defaultValue={field.value}
                  onChange={(country) => field.onChange(country.name)}
                />
              )}
            />
            {errors.country && <p className="text-sm text-red-600">{errors.country.message}</p>}
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
              error={errors.address?.message}
              {...register('address')}
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
                error={errors.city?.message}
                {...register('city')}
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
                error={errors.state?.message}
                {...register('state')}
              />
            </div>
            <div className="w-full">
              <Label htmlFor="zip" className="text-sm font-bold text-[#1F2937]">
                ZIP/Postal code
              </Label>
              <CustomInput
                type="text"
                id="zip"
                placeholder="Enter ZIP/Postal code"
                className="rounded-full border border-[#D1D5DB] bg-white"
                width="w-full"
                error={errors.postalCode?.message}
                {...register('postalCode')}
              />
            </div>
          </div>

          <PhoneInput
            id="phone"
            required
            label={'Phone'}
            placeholder="800 2738 9700"
            value={phoneValue}
            defaultCountry={(user?.phoneCountryCode as never) ?? 'FR'}
            isEdit={true}
            error={errors.phone?.message}
            onChange={(value) => {
              setValue('phone', value ?? '')
            }}
            onCountryChange={(country) => {
              setValue('countryCode', country ?? 'FR')
            }}
          />
        </div>
      </div>
    </div>
  )
})

UserInfoStep.displayName = 'UserInfoStep'

export default UserInfoStep
