import ArrowLeft from '@/assets/ArrowLeft'
import AuthLayout from '@/features/auth/components/layout/AuthLayout'
import ForgotPasswordForm from '@/features/auth/components/ui/ForgotPasswordForm'
import StepBox from '@/features/auth/components/ui/StepBox'
import { useStore } from '@/store/store'

const ForgotPasswordPage = () => {
  const STEPS = [
    { id: 1, label: 'Email' },
    { id: 2, label: 'Code' },
    { id: 3, label: 'Reset' },
  ]
  const { currentStep } = useStore((state) => state.auth)
  return (
    <AuthLayout>
      <section className="flex w-[650px] flex-col rounded-2xl bg-white/80 px-12 py-16 backdrop-blur-sm">
        <div className="flex items-center">
          <ArrowLeft />
          <div className="mx-auto flex items-center justify-center gap-3">
            {STEPS.map((step) => (
              <StepBox
                key={step.id}
                isCompleted={currentStep > step.id}
                allCompleted={currentStep > STEPS.length}
              />
            ))}
          </div>
        </div>
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-7 px-32">
          <h1 className="text-3xl font-bold text-[#102A63]">Forgot your password?</h1>
          <p className="text-[#8E949F]">
            Enter your email address to receive a password reset code.
          </p>
          <ForgotPasswordForm />
        </div>
      </section>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
