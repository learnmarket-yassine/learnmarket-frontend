import { useState } from 'react'
import ConfirmModal from '@/components/layout/ConfirmModal'
import EducationForm from '@/features/myProfile/components/ui/EducationForm'
import useDeleteEducation from '@/features/myProfile/hooks/useDeleteEducation'
import EducationImage from '@/assets/images/Education-Icon.png'
type EducationBoxProps = {
  id: string
  profileId?: string
  degree?: string
  institution: string
  startYear?: number
  endYear?: number
}

const EducationBox = ({ id, degree, institution, startYear, endYear }: EducationBoxProps) => {
  const { handleDeleteEducation, isPending } = useDeleteEducation()
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean | null>(false)

  return (
    <div className="flex h-[200px] items-start justify-between gap-6 rounded-2xl border border-[#E5E7EB] p-8">
      <div className="flex items-start gap-4">
        <img src={EducationImage} />
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-[#111827]">{institution}</h1>
          <h4 className="text-base text-[#4B5563]">{degree}</h4>
          <h6 className="text-sm text-[#6B7280]">
            {startYear} - {endYear}
          </h6>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <EducationForm edit={true} id={id} />
        <ConfirmModal
          name="education"
          type="delete"
          title={'Delete education'}
          description={'Are you sure you want to delete this education ?'}
          handleConfirm={async () => {
            await handleDeleteEducation(id ?? '')
            setIsDeleteOpen(false)
          }}
          buttonClassName="border-none"
          isLoading={isPending}
          isOpen={!!isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
        />
      </div>
    </div>
  )
}

export default EducationBox
