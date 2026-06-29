import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EditIcon from '@/assets/EditIcon'

interface EditButtonProps {
  label: string
  onClick?: () => void
  className?: string
}

function EditButton({ label, onClick, className }: EditButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={onClick}
      className={`h-10 w-10 rounded-full border border-[#2563EB] text-[#2563EB] ${className ?? ''}`}
    >
      <EditIcon className="size-5" />
    </Button>
  )
}
export default EditButton
