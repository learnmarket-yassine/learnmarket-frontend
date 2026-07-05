import EmploymentForm from '@/features/myProfile/components/ui/EmploymentForm'
import EmptyBox from '../../ui/EmptyBox'
import { useStore } from '@/store/store'
import EmploymentBox from '../../ui/EmploymentBox'

const ExperienceStep = () => {
  const user = useStore((state) => state.auth.user)
  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-[#1E293B]">
          If you have relevant work experience, add it here.
        </h1>
        <p className="max-w-[520px] text-sm text-[#4B5563]">
          Freelancers who add their experience are twice as likely to win work. But if you're just
          starting out, you can still create a great profile. Just head on to the next page.
        </p>
      </div>
      <div className="flex items-center gap-6">
        {(user?.tutorProfile?.employment ?? []).length > 0 ? (
          <div>
            <EmploymentForm edit={false} />
          </div>
        ) : null}
        <div className="flex flex-1 items-center gap-4">
          {(user?.tutorProfile?.employment ?? []).length > 0 ? (
            (user?.tutorProfile?.employment ?? []).map((employment) => (
              <EmploymentBox {...employment} />
            ))
          ) : (
            <EmptyBox title="Add experience">
              <EmploymentForm edit={false} />
            </EmptyBox>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExperienceStep
