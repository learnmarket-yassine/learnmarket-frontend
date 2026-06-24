import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { CustomInput } from '@/components/ui/CustomInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { LoginFormData, loginSchema } from '../../schemas'
import { useState } from 'react'

const LoginForm = () => {
  const [rememberMe, setRememberMe] = useState(false)
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const { register, formState, handleSubmit } = form

  const { errors } = formState

  const onSubmit = () => {}

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation()
        handleSubmit(onSubmit)(e)
      }}
      className="flex flex-col gap-6 sm:min-w-[100%]"
      noValidate
    >
      <CustomInput
        type="text"
        id="email"
        placeholder="mail@simple.com"
        label="Email"
        width="w-full"
        className={'rounded-full bg-white'}
        passwordinput={false}
        required={true}
        error={errors.email?.message}
        {...register('email')}
      />
      <CustomInput
        type="password"
        id="password"
        required={true}
        placeholder={'********'}
        label={'Password'}
        width="w-full"
        className="rounded-full bg-white"
        passwordinput={true}
        error={errors.password?.message}
        {...register('password')}
      />
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(!!checked)}
            className="h-5 w-5 cursor-pointer rounded-full border-[#6B7280]"
          />
          <label htmlFor="rememberMe" className="cursor-pointer text-sm text-[#6B7280]">
            Keep me logged in
          </label>
        </div>

        <Link to="/forgot-password" className="cursor-pointer text-sm text-[#2563EB] underline">
          Forgot password?
        </Link>
      </div>
      <div className="mt-8 flex w-full flex-col gap-11">
        <Button
          type="submit"
          data-mdb-button-init
          data-mdb-ripple-init
          className="h-full w-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-medium text-white hover:bg-[#2563EB]"
        >
          Log in
        </Button>
      </div>
    </form>
  )
}

export default LoginForm
