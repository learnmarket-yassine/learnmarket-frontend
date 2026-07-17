import { LearnRequestType } from '@/features/learn-requests/store/types'
import SessionTypeCard from '../../ui/SessionTypeCard'

const FORMATS: {
  type: LearnRequestType
  title: string
  description: string
}[] = [
  {
    type: 'ONE_TIME',
    title: 'One-time session',
    description: 'A single focused session to solve a specific problem.',
  },
  {
    type: 'COURSE',
    title: 'Ongoing course',
    description: 'A recurring series of sessions to build a skill over time.',
  },
]

type EntryStepProps = {
  selectedType: LearnRequestType | null
  onSelectType: (type: LearnRequestType) => void
}

const EntryStep = ({ selectedType, onSelectType }: EntryStepProps) => {
  return (
    <div className="grid w-full flex-1 grid-cols-5 gap-12">
      <div className="col-span-2 space-y-6">
        <h1 className="text-4xl font-bold text-[#143681]">Create your learning request.</h1>
        <p className="max-w-[400px] text-base text-[#6B7280]">
          Choose the type of learning support you need so tutors can quickly understand what you're
          looking for.
        </p>
      </div>
      <div className="col-span-3 space-y-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FORMATS.map((format) => (
            <SessionTypeCard
              key={format.type}
              {...format}
              selected={selectedType === format.type}
              onClick={() => onSelectType(format.type)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default EntryStep
