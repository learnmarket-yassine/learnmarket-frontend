import ArrowLeft from '@/assets/ArrowLeft'
import AuthLayout from '@/features/auth/components/layout/AuthLayout'
import StepBox from '@/features/auth/components/ui/StepBox'
import VerifCodeForm from '@/features/auth/components/ui/VerifCodeForm'
import { useStore } from '@/store/store'
import { useSearchParams } from 'react-router-dom'

const VerifCodePage = () => {
  const STEPS = [
    { id: 1, label: 'Email' },
    { id: 2, label: 'Code' },
    { id: 3, label: 'Reset' },
  ]
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? ''
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
          <h1 className="text-3xl font-bold text-[#102A63]">Verification Code</h1>
          <p className="text-[#8E949F]">
            A 6-digit code has been sent to your email address <strong>{email}.</strong>
          </p>
          <VerifCodeForm />
          <p className="cursor-pointer text-[#6B7280] underline">Resend code</p>
        </div>
      </section>
    </AuthLayout>
  )
}

export default VerifCodePage
