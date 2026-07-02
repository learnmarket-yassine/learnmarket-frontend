import * as React from 'react'
import { CheckIcon, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

export type ProficiencyOption = {
  value: string
  label: string
  description?: string
}

type ProficiencySelectProps = {
  options: ProficiencyOption[]
  value?: string
  onChange: (selected: ProficiencyOption) => void
  className?: string
  placeholder?: string
  error?: boolean
}

export const ProficiencySelect: React.FC<ProficiencySelectProps> = ({
  options,
  value = '',
  onChange,
  className,
  placeholder,
  error,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

  const selectedOption = options.find((v) => v.value === value)
  const onOptionSelect = (option: string) => {
    const selectedOption = options.find((v) => v.value === option)
    if (selectedOption) onChange(selectedOption)
    setIsPopoverOpen(false)
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          type="button"
          className={cn(
            'flex h-11 w-full items-center justify-between rounded-full p-1 [&_svg]:pointer-events-auto',
            error && 'border-red-500'
          )}
        >
          {selectedOption ? (
            <div className="flex w-full items-center justify-between">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center px-3 text-[#1D1B20]">{selectedOption.label}</div>
              </div>

              <ChevronDown className="mx-1 h-4 cursor-pointer text-[#1D1B20]" />
            </div>
          ) : (
            <div className="mx-auto flex w-full items-center justify-between">
              <span className="px-3 text-sm text-[#1D1B20]">{placeholder}</span>
              <ChevronDown className="mx-1 h-4 cursor-pointer text-[#1D1B20]" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('w-[var(--radix-popover-trigger-width)] p-0', className)}
        align="start"
      >
        <Command>
          <CommandList>
            <ScrollArea className="h-72 pr-2">
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = option.value === value
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => onOptionSelect(option.value)}
                      className="flex w-full cursor-pointer items-center gap-4 px-3 py-2.5 text-left font-medium transition-colors data-[selected=true]:bg-[#143681] data-[selected=true]:text-white"
                    >
                      <div
                        className={cn(
                          'mr-1 flex h-4 w-4 items-center justify-center',
                          isSelected ? 'text-primary' : 'invisible'
                        )}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold">{option.label}</span>
                        {option.description && (
                          <span className="text-xs font-normal leading-snug text-current opacity-70">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
ProficiencySelect.displayName = 'ProficiencySelect'
