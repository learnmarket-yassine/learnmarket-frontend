import { X } from 'lucide-react'

interface SkillChipProps {
  name: string
  id?: string
  onRemove?: (skillId: string) => void
}

function SkillChip({ name, id, onRemove }: SkillChipProps) {
  return (
    <span className="flex items-center gap-1 rounded-full border bg-[#143681] px-3 py-1 text-sm text-white">
      {name}
      {id && onRemove && (
        <button
          type="button"
          onClick={() => onRemove(id)}
          className="transition"
          aria-label={`Remove ${name}`}
        >
          <X size={12} />
        </button>
      )}
    </span>
  )
}

export default SkillChip
