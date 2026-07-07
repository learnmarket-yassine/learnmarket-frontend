import { CheckIcon, ChevronDown } from 'lucide-react'
import * as React from 'react'
import * as RPNInput from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input, InputProps } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ScrollArea } from './scroll-area'
import { Label } from './label'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

type PhoneInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> &
  Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
    onChange?: (value: RPNInput.Value) => void
    label: string
    required?: boolean
    error?: string
    isEdit?: boolean // Prop pour montrer l'icône d'édition
    onCountryChange?: (country: string) => void
  }

const PhoneInput = React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
  ({ onChange, error, onCountryChange, ...props }, ref) => {
    return (
      <div className="relative grid w-full items-center gap-2">
        <Label className="text-sm font-bold text-[#1F2937]">
          {props.label} {props.required && <span className="text-required">*</span>}
        </Label>
        <div className="relative">
          <div
            className={cn(
              'flex w-full items-center overflow-hidden rounded-full border', // add overflow-hidden
              error ? 'border-red-500' : 'border-[#D1D5DB]'
            )}
          >
            <RPNInput.default
              ref={ref}
              className="flex w-full"
              flagComponent={FlagComponent}
              countrySelectComponent={CountrySelect}
              inputComponent={InputComponent}

              onChange={(value) => onChange?.(value ?? '')}
              onCountryChange={(country) => onCountryChange?.(country ?? 'FR')}
              {...props}
            />
          </div>
          {error && (
            <span className="bg-inputBackground absolute left-2 top-3/4 block overflow-hidden text-ellipsis whitespace-normal px-1 text-xs font-normal text-red-600">
              {error}
            </span>
          )}
        </div>
      </div>
    )
  }
)
PhoneInput.displayName = 'PhoneInput'

const InputComponent = React.forwardRef<HTMLInputElement, InputProps & { error?: string }>(
  ({ className, error, ...props }, ref) => (
    <Input
      className={cn('border-none bg-white', className, error ? 'border-red-600' : '')}
      {...props}
      ref={ref}
    />
  )
)
InputComponent.displayName = 'InputComponent'

type CountrySelectOption = { label: string; value: RPNInput.Country }

type CountrySelectProps = {
  disabled?: boolean
  value: RPNInput.Country
  onChange: (value: RPNInput.Country) => void
  options: CountrySelectOption[]
}

const CountrySelect = ({ disabled, value, onChange, options }: CountrySelectProps) => {
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country)
    },
    [onChange]
  )

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={'ghost'}
          className={cn(
            'flex h-12 gap-1 rounded-e-none rounded-s-sm border-r-[1px] border-r-[#D1D5DB] px-3',
            disabled ? 'opacity-50' : 'opacity-100'
          )}
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <ChevronDown
            className={cn('-mr-2 h-4 w-4 opacity-50', disabled ? 'hidden' : 'opacity-100')}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mt-2 w-[250px]">
        <Command>
          <CommandList>
            <ScrollArea className="h-72">
              <CommandInput showSearchIcon={false} placeholder="Search country..." />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {options
                  .filter((x) => x.value)
                  .map((option) => (
                    <CommandItem
                      className="gap-2"
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <FlagComponent country={option.value} countryName={option.label} />
                      <span className="flex-1 text-sm">{option.label}</span>
                      {option.value && (
                        <span className="text-sm text-foreground/50">
                          {`+${RPNInput.getCountryCallingCode(option.value)}`}
                        </span>
                      )}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          option.value === value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country]
  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20">
      {Flag && <Flag title={countryName} />}
    </span>
  )
}
FlagComponent.displayName = 'FlagComponent'

export { PhoneInput }
