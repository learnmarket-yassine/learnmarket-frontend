import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
      className={`h-8 w-8 rounded-full text-muted-foreground hover:text-foreground ${className ?? ''}`}
    >
      <Plus className="h-4 w-4" />
    </Button>
  )
}
export default AddButton
