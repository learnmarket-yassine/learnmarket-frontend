import * as React from 'react'
import { CheckIcon, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from './button'
import { ScrollArea } from './scroll-area'

export type SelectOption = {
  value: string
  label: string
}

type SearchableSelectProps = {
  options: SelectOption[]
  value?: string
  onValueChange?: (v: string) => void
  className?: string
  placeholder?: string
  error?: boolean
  disabled?: boolean
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value = '',
  onValueChange,
  className,
  placeholder,
  error,
  disabled = false,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

  const selectedOption = options.find((v) => v.value === value)
  const onOptionSelect = (option: string) => {
    onValueChange?.(option)
    setIsPopoverOpen(false)
  }

  return (
    <Popover
      open={disabled ? false : isPopoverOpen}
      onOpenChange={(open) => {
        if (!disabled) {
          setIsPopoverOpen(open)
        }
      }}
      modal={true}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          type="button"
          disabled={disabled}
          className={cn(
            'flex h-11 w-full items-center justify-between rounded-full p-1 [&_svg]:pointer-events-auto',
            error && 'border-red-500',
            disabled && 'cursor-not-allowed bg-[#D9D9D9] opacity-50'
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
            <CommandInput
              placeholder="Search..."
              className="w-full rounded-full border py-2.5 pl-10 pr-4 text-sm focus:outline-none"
            />
            <ScrollArea className="h-72 px-3">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedOption?.value === option.value
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => onOptionSelect(option.value)}
                      className="flex w-full cursor-pointer items-center gap-4 rounded-full px-3 py-2.5 text-left font-medium transition-colors data-[selected=true]:bg-[#143681] data-[selected=true]:text-white"
                    >
                      <div
                        className={cn(
                          'mr-1 flex h-4 w-4 items-center justify-center',
                          isSelected ? 'text-primary' : 'invisible'
                        )}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <span>{option.label}</span>
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
SearchableSelect.displayName = 'SearchableSelect'
