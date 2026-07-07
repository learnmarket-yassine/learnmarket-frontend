import { useStore } from '@/store/store'
import EmptyBox from '../../ui/EmptyBox'
import EducationForm from '@/features/myProfile/components/ui/EducationForm'
import EducationBox from '../../ui/EducationBox'

const EducationStep = () => {
  const user = useStore((state) => state.auth.user)
  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <h1 className="max-w-[500px] text-4xl font-bold text-[#1E293B]">
          Clients like to know what you know - add your education here.
        </h1>
        <p className="max-w-[540px] text-sm text-[#4B5563]">
          You don't have to have a degree. Adding any relevant education helps make your profile
          more visible.
        </p>
      </div>
      <div className="space-y-4">
        {(user?.tutorProfile?.education ?? []).length > 0 ? (
          (user?.tutorProfile?.education ?? []).map((education) => (
            <EducationBox key={education.id} {...education} />
          ))
        ) : (
          <EmptyBox title="Add education">
            <EducationForm edit={false} />
          </EmptyBox>
        )}
      </div>
    </div>
  )
}

export default EducationStep
