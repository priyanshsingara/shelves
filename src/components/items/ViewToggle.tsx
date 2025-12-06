'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Grid, List } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ViewToggleProps {
  currentView: string
}

export function ViewToggle({ currentView }: ViewToggleProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setView = (view: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', view)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center bg-beige-dark rounded-xl p-1">
      <button
        onClick={() => setView('grid')}
        className={cn(
          'p-2 rounded-lg transition-colors',
          currentView === 'grid' 
            ? 'bg-card text-text-primary shadow-sm' 
            : 'text-text-muted hover:text-text-secondary'
        )}
      >
        <Grid className="w-4 h-4" />
      </button>
      <button
        onClick={() => setView('list')}
        className={cn(
          'p-2 rounded-lg transition-colors',
          currentView === 'list' 
            ? 'bg-card text-text-primary shadow-sm' 
            : 'text-text-muted hover:text-text-secondary'
        )}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  )
}



