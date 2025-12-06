'use client'

import { Check } from 'lucide-react'
import { PASTEL_COLORS } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  className?: string
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {PASTEL_COLORS.map((color) => (
        <button
          key={color.value}
          type="button"
          onClick={() => onChange(color.value)}
          className={cn(
            'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200',
            'hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-text-primary',
            value === color.value && 'ring-2 ring-text-primary ring-offset-2'
          )}
          style={{ backgroundColor: color.value }}
          title={color.name}
        >
          {value === color.value && (
            <Check className="w-4 h-4 text-text-primary" />
          )}
        </button>
      ))}
    </div>
  )
}



