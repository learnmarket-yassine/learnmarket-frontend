import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { TutorProfile } from '../../store/types'
import EditButton from '../ui/EditButton'
import AddButton from '../ui/AddButton'
import HeadlineForm from '../ui/HeadLineForm'

interface MyProfileMainContentProps {
  myProfile: TutorProfile
}

function MyProfileMainContent({ myProfile }: MyProfileMainContentProps) {
  const [activeWorkTab, setActiveWorkTab] = useState<'completed' | 'in_progress'>('completed')

  return (
    <div className="flex flex-col divide-y divide-[#D1D5DA] divide-border border-l border-l-[#D1D5DA] bg-white">
      {/* Headline + rate */}
      <div>
        <div className="flex items-start justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4">
            <h2 className="flex-1 text-2xl font-semibold leading-snug text-[#143681]">
              {myProfile.headline}
            </h2>
            <div>
              <HeadlineForm edit={true} />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-2xl font-semibold text-[#143681]">
              ${myProfile.hourlyRate}.00/hr
            </span>
            <EditButton label="Edit headline and rate" />
          </div>
        </div>
        {/* Bio */}

        <div className="relative p-8">
          <div className="absolute right-4 top-4">
            <EditButton label="Edit bio" />
          </div>
          <p className="pr-5 text-xl text-[#143681]">{myProfile.bio}</p>
        </div>
      </div>

      {/* Portfolio */}
      <div className="p-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-[#143681]">Portfolio</h3>
          <AddButton label="Add portfolio item" />
        </div>
      </div>

      {/* Work history */}
      <div className="space-y-5 p-8">
        <h3 className="mb-3 text-2xl font-semibold text-[#143681]">Work history</h3>
        {/* Tabs */}
        <div className="flex gap-4">
          <WorkHistoryTab
            label={`Completed jobs (${myProfile.completedJobs})`}
            active={activeWorkTab === 'completed'}
            onClick={() => setActiveWorkTab('completed')}
          />
          <WorkHistoryTab
            label={`In progress (${myProfile.inProgressJobs})`}
            active={activeWorkTab === 'in_progress'}
            onClick={() => setActiveWorkTab('in_progress')}
          />
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-5 p-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-[#143681]">Skills</h3>
          <EditButton label="Edit skills" />
        </div>
        <div className="flex flex-wrap gap-2">
          {myProfile.skills.map((skill) => (
            <Badge
              key={skill.id}
              variant="secondary"
              className="h-9 rounded-lg border-none bg-[#F5F6F7] px-4 py-2 text-sm text-[#102A63]"
            >
              {skill.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
export default MyProfileMainContent
// ── Internal tab button ───────────────────────────────────────────────────────
function WorkHistoryTab({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 py-2.5 pr-2.5 text-xl text-[#143681] transition-colors ${
        active ? 'border-[#143681] font-semibold' : 'border-transparent font-light'
      }`}
    >
      {label}
    </button>
  )
}
