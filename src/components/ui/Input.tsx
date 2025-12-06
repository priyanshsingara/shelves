'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-xl border',
            'bg-card text-text-primary placeholder:text-text-muted',
            'border-border focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent',
            'transition-colors',
            error && 'border-pastel-coral focus:ring-pastel-coral',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-pastel-coral">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
