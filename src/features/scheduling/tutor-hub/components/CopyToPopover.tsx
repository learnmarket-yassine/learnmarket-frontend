import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { dayLabel } from '../../utils/time'

interface CopyToPopoverProps {
  dayIndex: number
  onCopy: (targetDayIndexes: number[]) => void
}

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6]

const CopyToPopover = ({ dayIndex, onCopy }: CopyToPopoverProps) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<number[]>([])
  const targets = ALL_DAYS.filter((day) => day !== dayIndex)

  const toggle = (day: number) => {
    setSelected((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const apply = () => {
    if (selected.length === 0) return
    onCopy(selected)
    setSelected([])
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setSelected([])
      }}
    >
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" size="sm">
          <Copy /> Copy to...
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0">
        <Command>
          <CommandList>
            <CommandGroup heading="Copy this day's hours to">
              {targets.map((day) => (
                <CommandItem key={day} onSelect={() => toggle(day)}>
                  <span
                    className={cn(
                      'mr-2 flex size-4 items-center justify-center rounded-sm border border-border',
                      selected.includes(day) && 'border-primary bg-primary text-primary-foreground'
                    )}
                  >
                    {selected.includes(day) && <Check className="size-3" />}
                  </span>
                  {dayLabel(day)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <div className="flex justify-end border-t border-border p-2">
            <Button type="button" size="sm" disabled={selected.length === 0} onClick={apply}>
              Apply
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default CopyToPopover
