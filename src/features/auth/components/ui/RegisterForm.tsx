import { useForm } from 'react-hook-form'
import { SignupFormData, signupSchema } from '@/features/auth/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { CustomInput } from '@/components/ui/CustomInput'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const RegisterForm = () => {
  const [terms, setTerms] = useState<boolean>(false)

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })
  const { register, formState, handleSubmit, clearErrors, setError, setValue, reset, watch } = form

  return (
    <form
      className="flex h-full w-full flex-col gap-7"
      onSubmit={handleSubmit(() => {})}
      noValidate
    >
      <div className="flex h-full flex-col gap-6">
        <div className="flex w-full items-center justify-between gap-12">
          <CustomInput
            type="text"
            id="firstName"
            {...register('firstName')}
            placeholder="Yassine"
            required
            label="First Name"
            width="w-full"
          />
          <CustomInput
            type="text"
            id="lastName"
            required
            label={'Last Name'}
            placeholder={'Ben Hadj Ali'}
            width="w-full"
            {...register('lastName')}
          />
        </div>
        <div className="flex w-full items-center justify-between gap-12">
          <CustomInput
            type="email"
            id="email"
            placeholder={'foulen16@gmail.com'}
            required
            label={'Email'}
            width="w-full"
            {...register('email')}
          />
        </div>
        <div className="flex w-full items-center justify-between gap-12">
          <CustomInput
            type="password"
            id="password"
            placeholder={'********'}
            label={'Password'}
            width="w-full"
            required
            className="bg-white"
            passwordinput
            {...register('password')}
          />
          <CustomInput
            type="password"
            id="confirmer-password"
            placeholder={'********'}
            label={'Confirm Password'}
            width="w-full"
            required
            className="bg-white"
            passwordinput
            {...register('confirmPassword')}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={terms}
            onClick={() => setTerms(!terms)}
            className="h-5 w-5 cursor-pointer rounded-full border-[#5182EF] text-[#5182EF]"
          />
          <label htmlFor="terms" className="cursor-pointer text-sm text-[#6B7280]">
            I have read and accepted Yora's Terms of Use
          </label>
        </div>
      </div>
      <Button
        type="submit"
        data-mdb-button-init
        data-mdb-ripple-init
        className="h-full w-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-medium text-white hover:bg-[#2563EB]"
      >
        Sign Up
      </Button>
    </form>
  )
}

export default RegisterForm
