import { RadioGroupItem } from '@/components/ui/radio-group'
import { ProficiencyLevel } from '../../store/types'

type LevelCardProps = {
  value: ProficiencyLevel
  label: string
  description: string
  icon: React.ReactNode
  id: string
}

const LevelCard: React.FC<LevelCardProps> = ({ id, value, label, icon, description }) => {
  return (
    <label
      htmlFor={id}
      className="flex flex-1 cursor-pointer flex-col items-center gap-3 rounded-xl border border-[#D1D5DA] p-2 text-center hover:border-[#143681]"
    >
      {icon}
      <div className="flex flex-1 flex-col gap-1">
        <h2 className="text-base font-semibold">{label}</h2>
        <p className="text-sm">{description}</p>
      </div>
      <RadioGroupItem value={value} id={id} className="h-8 w-8" indicatorClassName="w-5 h-5" />
    </label>
  )
}

export default LevelCard
