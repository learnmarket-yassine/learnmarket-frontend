import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TutorProfile } from '../../store/types'
import EditButton from '../ui/EditButton'

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
      <SidebarRow label="Video introduction" addLabel="Add video introduction" onAdd={() => {}} />

      {/* Hours per week */}
      <SidebarRow label="Hours per week" onEdit={() => {}} editLabel="Edit hours per week">
        <p className="text-sm text-[#143681]">{myProfile.hoursPerWeek}</p>
        <p className="text-sm text-[#143681]">No contract-to-hire preference set</p>
      </SidebarRow>

      {/* Languages */}
      <SidebarRow
        label="Languages"
        onAdd={() => {}}
        onEdit={() => {}}
        addLabel="Add language"
        editLabel="Edit languages"
      >
        <ul className="mt-1 space-y-0.5">
          {myProfile.languages.map((lang: any) => (
            <li key={lang.name} className="text-sm font-normal text-[#143681]">
              <span className="font-semibold">{lang.name}</span>: {lang.level}
            </li>
          ))}
        </ul>
      </SidebarRow>

      {/* Education */}
      <SidebarRow label="Education" onAdd={() => {}} addLabel="Add education">
        {myProfile.education.map((edu: any) => (
          <div key={edu.institution} className="flex items-center justify-between">
            <div className="text-sm font-normal text-[#143681]">
              <p className="font-semibold">{edu.institution}</p>
              <p>{edu.degree}</p>
              <p>{edu.period}</p>
            </div>
            <div className="mt-1 flex gap-1">
              <EditButton label="Edit education" onClick={() => {}} />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Delete education"
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </SidebarRow>
    </div>
  )
}
export default MyProfileLeftSidebar
// ── Internal helper ───────────────────────────────────────────────────────────
interface SidebarRowProps {
  label: string
  children?: React.ReactNode
  onAdd?: () => void
  onEdit?: () => void
  addLabel?: string
  editLabel?: string
}

function SidebarRow({ label, children, onAdd, onEdit, addLabel, editLabel }: SidebarRowProps) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between">
        <p className="text-xl font-semibold text-[#143681]">{label}</p>
        <div className="flex items-center gap-1">
          {onAdd && (
            <Button
              variant="ghost"
              size="icon"
              aria-label={addLabel ?? `Add ${label}`}
              onClick={onAdd}
              className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
          {onEdit && <EditButton label={editLabel ?? `Edit ${label}`} onClick={onEdit} />}
        </div>
      </div>
      {children}
    </div>
  )
}
