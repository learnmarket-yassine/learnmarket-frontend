import { Button } from '@/components/ui/button'
import TrashIcon from '@/assets/TrashIcon'

interface DeleteButtonProps {
  label: string
  onClick?: () => void
  className?: string
}

function DeleteButton({ label, onClick, className }: DeleteButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={onClick}
      className={`h-10 w-10 rounded-full border border-[#2563EB] text-[#2563EB] ${className ?? ''}`}
    >
      <TrashIcon className="size-4" />
    </Button>
  )
}
export default DeleteButton
