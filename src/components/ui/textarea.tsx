import * as React from 'react'

import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <textarea
          className={cn(
            'border-inputBorder bg-inputBackground placeholder:text-placeholder flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300',
            props.error && 'border-red-600 outline-none focus-visible:ring-transparent',
            className
          )}
          ref={ref}
          {...props}
        />
        {props.error && (
          <div>
            <p className="bg-inputBackground absolute bottom-[-0.4rem] left-2 block overflow-hidden text-ellipsis whitespace-nowrap px-1 text-xs font-normal text-red-600">
              {' '}
              {props.error}{' '}
            </p>
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
