import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { CustomInput } from '@/components/ui/CustomInput'
import GoogleButton from '@/features/auth/components/ui/GoogleButton'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  return (
    <section className="flex w-[650px] items-center justify-center rounded-2xl bg-white/80 px-44 py-16 backdrop-blur-sm">
      <div className="flex w-full flex-col items-center justify-center gap-7">
        <h1 className="text-3xl font-bold text-[#102A63]">Welcome back</h1>
        <p className="text-[#8E949F]">Enter your email and password to access your account.</p>
        <GoogleButton />
        <div className="flex w-full items-center justify-center gap-2">
          <hr className="flex-grow border-t border-[#ADADAD]" />
          <div className="text-[#102A63]">Or</div>
          <hr className="flex-grow border-t border-[#ADADAD]" />
        </div>
        <form className="flex flex-col gap-6 sm:min-w-[100%]" noValidate>
          <CustomInput
            type="text"
            id="email"
            placeholder="mail@simple.com"
            label="Email"
            width="w-full"
            className={'rounded-full bg-white'}
            passwordinput={false}
            required={true}
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
          />
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
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
      </div>
    </section>
  )
}

export default LoginPage
