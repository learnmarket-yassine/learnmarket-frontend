import { Button } from '@/components/ui/button'
import { CustomInput } from '@/components/ui/CustomInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { forgotPasswordSchema, ForgotPasswordValues } from '../../schemas'
import useForgotPassword from '../../hooks/useForgotPassword'

const ForgotPasswordForm = () => {
  const forgotPassword = useForgotPassword()
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })
  const { register, formState, handleSubmit } = form
  const { errors } = formState

  const onSubmit = (data: ForgotPasswordValues) => {
    forgotPassword.mutate(data)
  }

  return (
    <form
      className="flex w-full flex-col gap-3"
      onSubmit={(e) => {
        e.stopPropagation()
        handleSubmit(onSubmit)(e)
      }}
      noValidate
    >
      <CustomInput
        type="text"
        id="email"
        placeholder="mail@simmmple.com"
        label={'Email'}
        width="w-full"
        className={'rounded-full bg-white'}
        passwordinput={false}
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="mt-8 flex flex-col gap-11">
        <Button
          type="submit"
          data-mdb-button-init
          data-mdb-ripple-init
          className="h-full w-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-medium text-white hover:bg-[#2563EB]"
        >
          Send code
        </Button>
      </div>
    </form>
  )
}

export default ForgotPasswordForm
