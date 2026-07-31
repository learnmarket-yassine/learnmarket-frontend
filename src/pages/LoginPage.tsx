import AuthLayout from '@/features/auth/components/layout/AuthLayout'
import LoginForm from '@/features/auth/components/ui/LoginForm'

const LoginPage = () => {
  return (
    <AuthLayout>
      <section className="flex w-[650px] items-center justify-center rounded-2xl bg-white/80 px-44 py-16 backdrop-blur-sm">
        <div className="flex w-full flex-col items-center justify-center gap-7">
          <h1 className="text-3xl font-bold text-[#102A63]">Welcome back</h1>
          <p className="text-[#8E949F]">Enter your email and password to access your account.</p>
          <LoginForm />
        </div>
      </section>
    </AuthLayout>
  )
}

export default LoginPage
