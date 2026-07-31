import ArrowLeft from '@/assets/ArrowLeft'
import AuthLayout from '@/features/auth/components/layout/AuthLayout'
import StepBox from '@/features/auth/components/ui/StepBox'
import VerifCodeForm from '@/features/auth/components/ui/VerifCodeForm'
import useForgotPassword from '@/features/auth/hooks/useForgotPassword'
import { useStore } from '@/store/store'
import { useNavigate, useSearchParams } from 'react-router-dom'

const VerifCodePage = () => {
  const STEPS = [
    { id: 1, label: 'Email' },
    { id: 2, label: 'Code' },
    { id: 3, label: 'Reset' },
  ]
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const { currentStep, setCurrentStep } = useStore((state) => state.auth)
  const navigate = useNavigate()
  const resendCode = useForgotPassword()

  const handleBack = () => {
    setCurrentStep(1)
    navigate(-1)
  }

  const handleResend = () => {
    if (!email || resendCode.isPending) return
    resendCode.mutate({ email })
  }

  return (
    <AuthLayout>
      <section className="flex w-[650px] flex-col rounded-2xl bg-white/80 px-12 py-16 backdrop-blur-sm">
        <div className="flex items-center">
          <button type="button" aria-label="Go back" onClick={handleBack}>
            <ArrowLeft />
          </button>
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
          <h1 className="text-3xl font-bold text-[#102A63]">Verification Code</h1>
          <p className="text-[#8E949F]">
            A 6-digit code has been sent to your email address <strong>{email}.</strong>
          </p>
          <VerifCodeForm />
          <p
            role="button"
            onClick={handleResend}
            className={
              resendCode.isPending
                ? 'cursor-not-allowed text-[#8E949F] underline'
                : 'cursor-pointer text-[#6B7280] underline'
            }
          >
            {resendCode.isPending
              ? 'Sending...'
              : resendCode.isSuccess
                ? 'Code resent'
                : 'Resend code'}
          </p>
        </div>
      </section>
    </AuthLayout>
  )
}

export default VerifCodePage
