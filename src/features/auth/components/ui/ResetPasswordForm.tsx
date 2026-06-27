import { Button } from '@/components/ui/button'
import { CustomInput } from '@/components/ui/CustomInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { resetPasswordSchema, ResetPasswordValues } from '../../schemas'
import { usePasswordValidation } from '../../hooks/usePasswordValidation'
import PasswordRuleItem from './PasswordRuleItem'

const ResetPasswordForm = () => {
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  })
  const { register, formState, control } = form
  const { errors } = formState
  const password = useWatch({ control, name: 'password' }) ?? ''
  const { results, isValid } = usePasswordValidation(password)

  return (
    <form
      className="flex w-full flex-col gap-3"
      onSubmit={(e) => {
        e.stopPropagation()
      }}
      noValidate
    >
      <CustomInput
        type="password"
        id="password"
        placeholder={'********'}
        label={'Password'}
        width="w-full"
        required
        className="rounded-full bg-white"
        passwordinput
        error={errors.password?.message}
        {...register('password')}
      />
      <CustomInput
        type="password"
        id="confirmer-password"
        placeholder={'********'}
        label={'Confirm Password'}
        width="w-full"
        required
        className="rounded-full bg-white"
        passwordinput
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <ul className="mt-1 flex flex-col gap-1.5">
        {results.map((rule) => (
          <PasswordRuleItem
            key={rule.id}
            label={rule.label}
            passed={rule.passed}
            isError={rule.isError}
          />
        ))}
      </ul>
      <div className="mt-8 flex flex-col gap-11">
        <Button
          type="submit"
          data-mdb-button-init
          data-mdb-ripple-init
          className="h-full w-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-medium text-white hover:bg-[#2563EB]"
        >
          Save password
        </Button>
      </div>
    </form>
  )
}

export default ResetPasswordForm
