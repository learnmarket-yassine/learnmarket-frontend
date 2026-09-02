import { useEffect, useState } from 'react'
import { CalendarIcon, PlusIcon } from 'lucide-react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CustomInput } from '@/components/ui/CustomInput'
import Loader from '@/components/ui/Loader/Loader'
import { useStore } from '@/store/store'
import { getAssetUrl } from '@/lib/utils'
import UserRoundIcon from '@/assets/UserRoundIcon'
import { Calendar } from '@/components/ui/calendar'
import { CountryDropdown } from '@/components/ui/CountryDropdown'
import { PhoneInput } from '@/components/ui/PhoneInput'
import UploadImageForm from '@/features/onboarding/components/ui/UploadImageModal'
import useEditUserInfo from '@/features/myProfile/hooks/useEditUser'
import { UserInfoFormData, userInfoSchema } from '../../schema/schema'

const EditAccountForm = () => {
  const user = useStore((state) => state.auth.user)
  const avatarUrl = getAssetUrl(user?.avatar)
  const { mutateAsync: editUserMutation, isPending } = useEditUserInfo()

  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

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

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = form

  const phoneValue = watch('phone')

  useEffect(() => {
    if (!user) return
    reset({
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
      country: user.country ?? '',
      address: user.address ?? '',
      city: user.city ?? '',
      state: user.state ?? '',
      postalCode: user.postalCode ?? '',
      phone: user.phone ?? '',
      countryCode: user.phoneCountryCode ?? 'FR',
    })
  }, [user, reset])

  const onSubmit: SubmitHandler<UserInfoFormData> = async (data) => {
    await editUserMutation({
      dateOfBirth: data.dateOfBirth?.toISOString(),
      country: data.country,
      address: data.address,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      phone: data.phone,
      phoneCountryCode: data.countryCode,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex h-full min-h-0 flex-col gap-8">
      {/* Profile picture */}
      <div className="flex flex-1 items-start gap-10">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[#E5E7EB]">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${user?.firstname ?? ''} ${user?.lastname ?? ''}`}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <UserRoundIcon className="size-20" />
            )}

            <div className="absolute right-1 top-3/4 flex h-7 w-7 items-center justify-center rounded-full border border-white bg-[#10A310]">
              <PlusIcon className="size-5 text-white" />
            </div>
          </div>
          <UploadImageForm />
        </div>

        {/* Account information */}
        <div className="w-full space-y-3">
          {/* Date of Birth */}
          <div className="space-y-1">
            <Label htmlFor="date-of-birth" className="text-sm font-semibold text-[#1F2937]">
              Date of Birth *
            </Label>

            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field }) => (
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-of-birth"
                      type="button"
                      variant="outline"
                      className="h-12 w-full justify-start rounded-full border border-[#D1D5DB] bg-white text-left text-sm font-normal text-[#6B7280] placeholder:text-[#9CA3AF]"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />

                      {field.value ? format(field.value, 'PPP') : 'Select date of birth'}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date)
                        setIsCalendarOpen(false)
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <PhoneInput
              id="phone"
              required
              label={'Phone'}
              placeholder="Enter phone number"
              value={phoneValue}
              defaultCountry={(user?.phoneCountryCode as never) ?? 'FR'}
              isEdit={true}
              error={errors.phone?.message}
              onChange={(value) => {
                setValue('phone', value ?? '', {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }}
              onCountryChange={(country) => {
                setValue('countryCode', country ?? 'FR', {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }}
            />
            <div className="space-y-1">
              <Controller
                control={control}
                name="country"
                render={({ field }) => (
                  <CountryDropdown
                    required
                    label="Country"
                    placeholder="Select country"
                    defaultValue={field.value}
                    onChange={(country) => field.onChange(country.name)}
                  />
                )}
              />

              {errors.country && <p className="text-sm text-red-600">{errors.country.message}</p>}
            </div>
          </div>
          {/* City / State / Postal Code / Street address */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="street" className="text-sm font-semibold text-[#1F2937]">
                Street Address *
              </Label>

              <CustomInput
                id="street"
                type="text"
                placeholder="Enter street address"
                className="rounded-full border border-[#D1D5DB] bg-white"
                width="w-full"
                error={errors.address?.message}
                {...register('address')}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="city" className="text-sm font-semibold text-[#1F2937]">
                City *
              </Label>

              <CustomInput
                id="city"
                type="text"
                placeholder="Enter city"
                className="rounded-full border border-[#D1D5DB] bg-white"
                width="w-full"
                error={errors.city?.message}
                {...register('city')}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="state" className="text-sm font-semibold text-[#1F2937]">
                State / Province
              </Label>

              <CustomInput
                id="state"
                type="text"
                placeholder="Enter state/province"
                className="rounded-full border border-[#D1D5DB] bg-white"
                width="w-full"
                error={errors.state?.message}
                {...register('state')}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="postal-code" className="text-sm font-semibold text-[#1F2937]">
                ZIP / Postal Code
              </Label>
              <CustomInput
                id="postal-code"
                type="text"
                placeholder="Enter postal code"
                className="rounded-full border border-[#D1D5DB] bg-white"
                width="w-full"
                error={errors.postalCode?.message}
                {...register('postalCode')}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="oldPassword" className="text-sm font-semibold text-[#1F2937]">
                Current Password
              </Label>
              <CustomInput
                type="password"
                id="oldPassword"
                placeholder={'********'}
                width="w-full"
                className="rounded-full border border-[#D1D5DB] bg-white"
                passwordinput
                error={errors.oldPassword?.message}
                {...register('oldPassword')}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="newPassword" className="text-sm font-semibold text-[#1F2937]">
                New Password
              </Label>
              <CustomInput
                type="password"
                id="newPassword"
                placeholder={'********'}
                width="w-full"
                className="rounded-full border border-[#D1D5DB] bg-white"
                passwordinput
                error={errors.newPassword?.message}
                {...register('newPassword')}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium"
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="h-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-medium text-white hover:bg-[#2563EB]"
          disabled={isPending}
        >
          {isPending ? <Loader fillColor="#FFFFFF" width="22" height="22" /> : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

export default EditAccountForm
