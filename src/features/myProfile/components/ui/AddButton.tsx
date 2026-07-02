import { Button } from '@/components/ui/button'
import PlusIcon from '@/assets/PlusIcon'

interface AddButtonProps {
  label: string
  onClick?: () => void
  className?: string
}

function AddButton({ label, onClick, className }: AddButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={onClick}
      className={`h-10 w-10 rounded-full border border-[#2563EB] text-[#2563EB] ${className ?? ''}`}
    >
      <PlusIcon className="size-4" />
    </Button>
  )
}
export default AddButton
