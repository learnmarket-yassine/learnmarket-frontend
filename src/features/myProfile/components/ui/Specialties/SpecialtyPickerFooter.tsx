import { Specialty } from '@/types/category'

interface SpecialtyPickerFooterProps {
  value: Specialty[]
  maxSpecialties: number
  atLimit: boolean
  error?: string
}

function SpecialtyPickerFooter({
  value,
  maxSpecialties,
  atLimit,
  error,
}: SpecialtyPickerFooterProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <p className={`text-sm ${atLimit ? 'text-red-600' : 'text-[#5E5E5E]'}`}>
        {value.length} / {maxSpecialties} specialties selected
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default SpecialtyPickerFooter
