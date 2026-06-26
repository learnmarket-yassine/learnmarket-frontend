import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Label } from './label'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
  width?: string
  passwordinput?: boolean
  error?: string
  disabled?: boolean
  gap?: string
  setValue?: (value: string) => void
}

const CustomInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, autoComplete, type, disabled, setValue, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState<boolean>(false)
    let inputType
    if (props?.passwordinput) {
      inputType = showPassword ? 'text' : 'password'
    } else {
      inputType = type
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue?.(event.target.value)
    }
    return (
      <div className={cn(`grid w-full items-center ${props.gap ?? 'gap-2'}`, props.width)}>
        <Label className="text-sm text-[#102A63]">
          {props.label} {props.required && <span className="text-required">*</span>}
        </Label>
        <div className="relative">
          <input
            type={inputType}
            className={cn(
              'placeholder:text-placeholder flex h-12 w-full rounded-sm px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
              props.passwordinput && 'pr-10',
              props.error && 'border border-red-600 outline-none focus-visible:ring-transparent',
              className
            )}
            autoComplete={autoComplete}
            ref={ref}
            disabled={disabled}
            onChange={handleChange}
            {...props}
          />
          {props?.passwordinput && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 mr-2 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={disabled}
            >
              {showPassword ? (
                <EyeIcon className="h-5 w-5 text-[#ADADAD]" aria-hidden="true" />
              ) : (
                <EyeOffIcon className="h-5 w-5 text-[#ADADAD]" aria-hidden="true" />
              )}
              <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
            </Button>
          )}
          {props.error && (
            <div>
              <p className="absolute left-2 block overflow-hidden text-ellipsis whitespace-normal px-1 text-xs font-normal text-red-600">
                {' '}
                {props.error}{' '}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }
)

CustomInput.displayName = 'Input'

export { CustomInput }
