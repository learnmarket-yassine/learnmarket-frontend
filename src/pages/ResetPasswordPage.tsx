import ArrowLeft from '@/assets/ArrowLeft'
import AuthLayout from '@/features/auth/components/layout/AuthLayout'
import ResetPasswordForm from '@/features/auth/components/ui/ResetPasswordForm'
import StepBox from '@/features/auth/components/ui/StepBox'
import { useStore } from '@/store/store'

const ResetPasswordPage = () => {
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
          <h1 className="text-3xl font-bold text-[#102A63]">Create a new password</h1>
          <p className="text-[#8E949F]">Choose a strong and secure password for your account.</p>
          <ResetPasswordForm />
        </div>
      </section>
    </AuthLayout>
  )
}

export default ResetPasswordPage
