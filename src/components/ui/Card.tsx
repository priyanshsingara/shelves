'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accentColor?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, accentColor, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-card rounded-2xl border border-border overflow-hidden',
          'shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
          'hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]',
          'transition-shadow duration-200',
          className
        )}
        {...props}
      >
        {accentColor && (
          <div 
            className="h-1 w-full" 
            style={{ backgroundColor: accentColor }}
          />
        )}
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'



