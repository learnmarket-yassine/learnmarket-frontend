import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
      className={`h-8 w-8 rounded-full text-muted-foreground hover:text-foreground ${className ?? ''}`}
    >
      <Pencil className="h-4 w-4" />
    </Button>
  )
}
export default EditButton
