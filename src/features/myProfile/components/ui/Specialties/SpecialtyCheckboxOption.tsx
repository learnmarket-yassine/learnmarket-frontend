import { Checkbox } from '@/components/ui/checkbox'
import { Specialty } from '@/types/category'

interface SpecialtyCheckboxOptionProps {
  specialty: Specialty
  checked: boolean
  disabled?: boolean
  onToggle: (specialty: Specialty) => void
}

function SpecialtyCheckboxOption({
  specialty,
  checked,
  disabled,
  onToggle,
}: SpecialtyCheckboxOptionProps) {
  return (
    <li>
      <label
        className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-[#143681] ${
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        }`}
      >
        <Checkbox
          checked={checked}
          disabled={disabled}
          onCheckedChange={() => onToggle(specialty)}
        />
        {specialty.name}
      </label>
    </li>
  )
}

export default SpecialtyCheckboxOption
