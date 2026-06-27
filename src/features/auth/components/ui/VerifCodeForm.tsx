import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { VerifCodeSchema, VerifCodeValues } from '../../schemas'
import { zodResolver } from '@hookform/resolvers/zod'

const VerifCodeForm = () => {
  const [otpValue, setOtpValue] = useState('')

  const from = useForm<VerifCodeValues>({
    resolver: zodResolver(VerifCodeSchema),
  })
  const { formState } = from
  const { errors } = formState
  return (
    <form
      className="flex w-full flex-col gap-3"
      onSubmit={(e) => {
        e.stopPropagation()
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
      {errors.code && <p className="text-red-600">{errors.code.message}</p>}

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
