import { Education, Language } from '../../store/types'
import CreateLanguageForm from '../ui/CreateLanguageForm'
import EditLanguagesForm from '../ui/EditLanguagesForm'
import EducationForm from '../ui/EducationForm'
import { languageLevelLabels } from '@/lib/Constants'
import { AuthUser } from '@/features/auth/store/types'
import ConfirmModal from '@/components/layout/ConfirmModal'
import useDeleteEducation from '../../hooks/useDeleteEducation'

interface LearnerProfileLeftSidebarProps {
  myProfile: AuthUser
}

function LearnerProfileLeftSidebar({ myProfile }: LearnerProfileLeftSidebarProps) {
  const { handleDeleteEducation, isPending: loadingDeleteEducation } = useDeleteEducation()

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
    </div>
  )
}
export default LearnerProfileLeftSidebar
