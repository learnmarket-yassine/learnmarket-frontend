import { Button } from '@/components/ui/button'
import { TutorProfile } from '../../store/types'
import EditButton from '../ui/EditButton'
import AvailabilityForm from '../ui/AvailabilityForm'
import VideoIntroForm from '../ui/VideoIntroForm'
import CreateLanguageForm from '../ui/CreateLanguageForm'
import EducationForm from '../ui/EducationForm'
import EditLanguagesForm from '../ui/EditLanguagesForm'
import DeleteButton from '../ui/DeleteButton'

interface MyProfileLeftSidebarProps {
  myProfile: TutorProfile
}

function MyProfileLeftSidebar({ myProfile }: MyProfileLeftSidebarProps) {
  return (
    <div className="flex flex-col bg-white p-8">
      {/* Connects */}
      <div className="space-y-3 rounded-xl bg-[#F5F6F7] p-5">
        <p className="text-xl font-bold text-[#143681]">Connects: {myProfile.connects}</p>
        <div className="flex gap-4 text-base text-[#143681]">
          <Button variant="link" className="h-auto p-0">
            View details
          </Button>
          <Button variant="link" className="h-auto p-0">
            Buy Connects
          </Button>
        </div>
      </div>

      {/* Video introduction */}
      <div className="flex items-center justify-between px-5 py-4">
        <p className="text-xl font-semibold text-[#143681]">Video introduction</p>
        <VideoIntroForm edit={false} />
      </div>
      {/* Hours per week */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold text-[#143681]">Hours per week</p>
          <AvailabilityForm edit />
        </div>
        <p className="text-sm text-[#143681]">{myProfile.hoursPerWeek}</p>
      </div>

      {/* Languages */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold text-[#143681]">Languages</p>
          <div className="flex gap-1">
            <CreateLanguageForm />
            <EditLanguagesForm />
          </div>
        </div>
        <ul className="mt-1 space-y-0.5">
          {myProfile.languages.map((lang: any) => (
            <li key={lang.name} className="text-sm font-normal text-[#143681]">
              <span className="font-semibold">{lang.name}</span>: {lang.level}
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
        {myProfile.education.map((edu: any) => (
          <div key={edu.institution} className="flex items-center justify-between">
            <div className="text-sm font-normal text-[#143681]">
              <p className="font-semibold">{edu.institution}</p>
              <p>{edu.degree}</p>
              <p>{edu.period}</p>
            </div>
            <div className="mt-1 flex gap-1">
              <EditButton label="Edit education" onClick={() => {}} />
              <DeleteButton label="Delete education" onClick={() => {}} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default MyProfileLeftSidebar
