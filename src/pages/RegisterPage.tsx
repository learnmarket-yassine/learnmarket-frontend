import RegisterLayout from '@/features/auth/components/layout/RegisterLayout'
import RegisterForm from '@/features/auth/components/ui/RegisterForm'

const RegisterPage = () => {
  return (
    <RegisterLayout>
      <section className="container flex w-[650px] items-center justify-center">
        <div className="flex w-full flex-col items-center justify-center gap-7">
          <h1 className="text-3xl font-bold text-[#102A63]">Create your account</h1>
          <p className="text-[#8E949F]">Join Yora and start your learning or mentoring journey.</p>
          <RegisterForm />
        </div>
      </section>
    </RegisterLayout>
  )
}

export default RegisterPage
