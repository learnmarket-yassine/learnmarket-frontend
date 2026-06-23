import RegisterLayout from '@/features/auth/components/layout/RegisterLayout'
import GoogleButton from '@/features/auth/components/ui/GoogleButton'
import RegisterForm from '@/features/auth/components/ui/RegisterForm'

const RegisterPage = () => {
  return (
    <RegisterLayout>
      <section className="container flex w-[650px] items-center justify-center">
        <div className="flex w-full flex-col items-center justify-center gap-7">
          <h1 className="text-3xl font-bold text-[#102A63]">Create your account</h1>
          <p className="text-[#8E949F]">Join Yora and start your learning or mentoring journey.</p>
          <GoogleButton />
          <div className="flex w-full items-center justify-center gap-2">
            <hr className="flex-grow border-t border-[#ADADAD]" />
            <div className="text-[#102A63]">Or</div>
            <hr className="flex-grow border-t border-[#ADADAD]" />
          </div>
          <RegisterForm />
        </div>
      </section>
    </RegisterLayout>
  )
}

export default RegisterPage
