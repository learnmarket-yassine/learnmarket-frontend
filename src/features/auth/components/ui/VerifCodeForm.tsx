import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { VerifCodeSchema, VerifCodeValues } from '../../schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import useVerifyOtp from '../../hooks/useVerifyOtp'
import { useSearchParams } from 'react-router-dom'

const VerifCodeForm = () => {
  const [otpValue, setOtpValue] = useState('')
  const verifyOtp = useVerifyOtp()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const from = useForm<VerifCodeValues>({
    resolver: zodResolver(VerifCodeSchema),
    defaultValues: { email, otp: '' },
  })
  const { formState, handleSubmit, setValue } = from
  const { errors } = formState

  const onSubmit = (data: VerifCodeValues) => {
    verifyOtp.mutate(data)
  }
  useEffect(() => {
    setValue('otp', otpValue)
  }, [otpValue, setValue])

  return (
    <form
      className="flex w-full flex-col gap-3"
      onSubmit={(e) => {
        e.stopPropagation()
        handleSubmit(onSubmit)(e)
      }}
      noValidate
    >
      <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
        <InputOTPGroup className="flex w-full justify-between gap-3">
          <InputOTPSlot
            className="h-[60px] w-[72px] rounded-full border border-[#8E949F] text-2xl font-medium text-[#2563EB]"
            index={0}
          />
          <InputOTPSlot
            className="h-[60px] w-[72px] rounded-full border border-[#8E949F] text-2xl font-medium text-[#2563EB]"
            index={1}
          />
          <InputOTPSlot
            className="h-[60px] w-[72px] rounded-full border border-[#8E949F] text-2xl font-medium text-[#2563EB]"
            index={2}
          />
          <InputOTPSlot
            className="h-[60px] w-[72px] rounded-full border border-[#8E949F] text-2xl font-medium text-[#2563EB]"
            index={3}
          />
          <InputOTPSlot
            className="h-[60px] w-[72px] rounded-full border border-[#8E949F] text-2xl font-medium text-[#2563EB]"
            index={4}
          />
          <InputOTPSlot
            className="h-[60px] w-[72px] rounded-full border border-[#8E949F] text-2xl font-medium text-[#2563EB]"
            index={5}
          />
        </InputOTPGroup>
      </InputOTP>
      {errors.otp && <p className="text-red-600">{errors.otp.message}</p>}

      <div className="mt-8 flex flex-col gap-11">
        <Button
          type="submit"
          data-mdb-button-init
          data-mdb-ripple-init
          className="h-full w-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-medium text-white hover:bg-[#2563EB]"
        >
          Verify
        </Button>
      </div>
    </form>
  )
}

export default VerifCodeForm
