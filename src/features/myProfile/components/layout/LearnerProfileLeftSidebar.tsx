import { useState } from 'react'
import { Education, Language, AvailabilitySlotValue } from '../../store/types'
import CreateLanguageForm from '../ui/CreateLanguageForm'
import EditLanguagesForm from '../ui/EditLanguagesForm'
import AvailabilityCircleGrid from '../ui/AvailabilityCircleGrid'
import EducationForm from '../ui/EducationForm'
import EditButton from '../ui/EditButton'
import { Button } from '@/components/ui/button'
import { languageLevelLabels } from '@/lib/Constants'
import { AuthUser } from '@/features/auth/store/types'
import ConfirmModal from '@/components/layout/ConfirmModal'
import useDeleteEducation from '../../hooks/useDeleteEducation'
import useUpdateLearnerAvailability from '../../hooks/useUpdateLearnerAvailability'

interface LearnerProfileLeftSidebarProps {
  myProfile: AuthUser
}

function LearnerProfileLeftSidebar({ myProfile }: LearnerProfileLeftSidebarProps) {
  const { handleDeleteEducation, isPending: loadingDeleteEducation } = useDeleteEducation()
  const { mutate: updateAvailabilityMutation, isPending: savingAvailability } =
    useUpdateLearnerAvailability()
  const availability = myProfile.learnerProfile?.availability ?? []

  const [isEditingAvailability, setIsEditingAvailability] = useState(false)
  const [availabilityDraft, setAvailabilityDraft] = useState<AvailabilitySlotValue[]>(availability)

  const handleEditAvailabilityClick = () => {
    setAvailabilityDraft(availability)
    setIsEditingAvailability(true)
  }

  const handleCancelAvailability = () => {
    setIsEditingAvailability(false)
  }

  const handleSaveAvailability = () => {
    updateAvailabilityMutation(availabilityDraft, {
      onSuccess: () => setIsEditingAvailability(false),
    })
  }

  return (
    <div className="flex flex-col bg-white p-8">
      {/* Languages */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold text-[#143681]">Languages</p>
          <div className="flex gap-1">
            <CreateLanguageForm />
            {(myProfile?.languages ?? []).length > 0 && <EditLanguagesForm />}
          </div>
        </div>
        <ul className="mt-1 space-y-0.5">
          {myProfile?.languages.map((lang: Language) => (
            <li key={lang.language} className="text-sm font-normal text-[#143681]">
              <span className="font-semibold">{lang.language}</span>:{' '}
              {languageLevelLabels[lang.level] ?? lang.level}
            </li>
          ))}
        </ul>
      </div>

      {/* Education */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold text-[#143681]">Education</p>
          <EducationForm edit={false} />
        </div>
        {myProfile?.education.map((edu: Education) => (
          <div key={edu.id} className="flex items-center justify-between">
            <div className="text-sm font-normal text-[#143681]">
              <p className="font-semibold">{edu.institution}</p>
              <p>{edu.degree}</p>
              <p>
                {edu.startYear} - {edu.endYear}
              </p>
            </div>
            <div className="mt-1 flex gap-1">
              <EducationForm edit={true} id={edu.id} />
              <ConfirmModal
                name="education"
                type="delete"
                title={'Delete education'}
                description={'Are you sure you want to delete this education ?'}
                handleConfirm={() => handleDeleteEducation(edu?.id ?? '')}
                buttonClassName="border-none"
                isLoading={loadingDeleteEducation}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Availability */}
      <div className="space-y-4 px-5 py-4">
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold text-[#143681]">Availability</p>
          <EditButton label="edit availability" onClick={handleEditAvailabilityClick} />
        </div>
        <div className="space-y-4">
          <AvailabilityCircleGrid
            value={isEditingAvailability ? availabilityDraft : availability}
            onChange={setAvailabilityDraft}
            editable={isEditingAvailability}
          />
          {isEditingAvailability && (
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
                onClick={handleCancelAvailability}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="h-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-medium text-white hover:bg-[#2563EB]"
                onClick={handleSaveAvailability}
                disabled={savingAvailability}
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default LearnerProfileLeftSidebar
