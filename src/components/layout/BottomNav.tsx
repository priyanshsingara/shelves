'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Plus, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/feed', icon: Home, label: 'Feed' },
  { href: '/shelves', icon: BookOpen, label: 'Shelves' },
  { href: '/add', icon: Plus, label: 'Add', isAction: true },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-md border-t border-border safe-area-pb">
      <div className="max-w-[800px] mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon

            if (item.isAction) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-center w-12 h-12 bg-pastel-blue rounded-2xl shadow-lg hover:scale-105 transition-transform"
                >
                  <Icon className="w-6 h-6 text-text-primary" />
                </Link>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors',
                  isActive 
                    ? 'text-text-primary' 
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive && 'text-pastel-purple')} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}



