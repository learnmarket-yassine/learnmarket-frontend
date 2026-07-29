import { CheckCircle2, Circle } from 'lucide-react'

interface ChecklistItemProps {
  label: string
  met: boolean
}

const CheckListItem = ({ label, met }: ChecklistItemProps) => {
  return (
    <li className="flex w-full items-center gap-2 p-2 text-base">
      {met ? (
        <CheckCircle2 className="size-5 shrink-0 text-blue-600" aria-hidden="true" />
      ) : (
        <Circle className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
      )}
      <span className={met ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
    </li>
  )
}

export default CheckListItem
