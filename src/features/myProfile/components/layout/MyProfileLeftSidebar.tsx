import { Education, Language } from '../../store/types'
import AvailabilityForm from '../ui/AvailabilityForm'
import VideoIntroForm from '../ui/VideoIntroForm'
import CreateLanguageForm from '../ui/CreateLanguageForm'
import EducationForm from '../ui/EducationForm'
import EditLanguagesForm from '../ui/EditLanguagesForm'
import { hoursPerWeekLabels, languageLevelLabels } from '@/lib/Constants'
import { getYoutubeThumbnailUrl } from '@/lib/utils'
import VideoModal from '../ui/VideoModal'
import { useState } from 'react'
import { AuthUser } from '@/features/auth/store/types'
import useEditTutorProfile from '../../hooks/useEditTutorProfile'
import ConfirmModal from '@/components/layout/ConfirmModal'
import useDeleteEducation from '../../hooks/useDeleteEducation'

interface MyProfileLeftSidebarProps {
  myProfile: AuthUser
}

function MyProfileLeftSidebar({ myProfile }: MyProfileLeftSidebarProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const videoIntroUrl = myProfile.tutorProfile?.videoIntroUrl
  const videoThumbnailUrl = videoIntroUrl ? getYoutubeThumbnailUrl(videoIntroUrl) : undefined
  const { mutate: editTutorProfile, isPending } = useEditTutorProfile()
  const { handleDeleteEducation, isPending: loadingDeleteEducation } = useDeleteEducation()

  return (
    <div className="flex flex-col bg-white p-8">
      {/* Video introduction */}
      <div className="px-5 py-4">
        {!videoIntroUrl ? (
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold text-[#143681]">Video introduction</p>
            <VideoIntroForm edit={!!videoIntroUrl} />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-xl font-semibold text-[#143681]">Meet {myProfile.firstname}</p>
              <ConfirmModal
                name="faq"
                type="delete"
                title={'Delete video introduction'}
                description={'Are you sure you want to delete this video introduction ?'}
                handleConfirm={() => editTutorProfile({ videoIntroUrl: null })}
                buttonClassName="border-none"
                isLoading={isPending}
              />
            </div>
            <button
              type="button"
              onClick={() => setIsVideoOpen(true)}
              className="relative mt-3 block aspect-video w-full overflow-hidden rounded-[16px] bg-[#F5F6F7]"
            >
              <img
                src={videoThumbnailUrl}
                alt="Video introduction preview"
                className="h-full w-full object-cover"
              />
            </button>
          </>
        )}
      </div>
      {videoIntroUrl && (
        <VideoModal isOpen={isVideoOpen} setIsOpen={setIsVideoOpen} videoUrl={videoIntroUrl} />
      )}
      {/* Hours per week */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold text-[#143681]">Hours per week</p>
          <AvailabilityForm />
        </div>
        <p className="text-sm text-[#143681]">
          {myProfile.tutorProfile?.hoursPerWeek
            ? (hoursPerWeekLabels[myProfile.tutorProfile.hoursPerWeek] ??
              myProfile.tutorProfile.hoursPerWeek)
            : null}
        </p>
      </div>

      {/* Languages */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold text-[#143681]">Languages</p>
          <div className="flex gap-1">
            <CreateLanguageForm />
            {(myProfile.tutorProfile?.languages ?? []).length > 0 && <EditLanguagesForm />}
          </div>
        </div>
        <ul className="mt-1 space-y-0.5">
          {myProfile.tutorProfile?.languages.map((lang: Language) => (
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
        {myProfile.tutorProfile?.education.map((edu: Education) => (
          <div key={edu.institution} className="flex items-center justify-between">
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
export default MyProfileLeftSidebar
