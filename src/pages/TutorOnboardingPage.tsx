import TutorOnboardingForm from '@/features/onboarding/components/TutorOnboardingForm'
import { useStore } from '@/store/store'
import { Navigate } from 'react-router-dom'

const TutorOnboardingPage = () => {
  const user = useStore((state) => state.auth.user)

  if (!user) return null

  const isNotTutor = user.role !== 'TUTOR'
  const isCompleted = user.isProfileCompleted

  if (isNotTutor || isCompleted) {
    return <Navigate to="/profile" replace />
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div
        className="flex w-full max-w-2xl flex-col gap-6 rounded-2xl bg-white p-10"
        style={{ boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.08)' }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-[#143681]">Complete your tutor profile</h1>
          <p className="text-base text-[#5E5E5E]">
            Tell learners a bit about yourself before you get started. You won't be able to access
            your dashboard until this is done.
          </p>
        </div>

        <TutorOnboardingForm />
      </div>
    </div>
  )
}
export default TutorOnboardingPage
