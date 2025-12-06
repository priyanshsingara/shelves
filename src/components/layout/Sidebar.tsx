'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { X, Settings, LogOut, BookOpen, Heart, Users } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  user?: {
    name: string | null
    avatarUrl: string | null
  } | null
}

export function Sidebar({ isOpen, onClose, user }: SidebarProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-text-primary/20 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 bg-card shadow-2xl transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pastel-purple rounded-xl flex items-center justify-center">
              <span className="text-xl">📚</span>
            </div>
            <span className="font-semibold text-text-primary text-lg">linkink</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-beige-dark rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar src={user.avatarUrl} name={user.name} size="lg" />
              <div>
                <p className="font-medium text-text-primary">{user.name || 'User'}</p>
                <Link href="/profile" className="text-sm text-text-muted hover:text-pastel-purple">
                  View profile
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <SidebarLink href="/shelves" icon={BookOpen} onClick={onClose}>
            My Shelves
          </SidebarLink>
          <SidebarLink href="/liked" icon={Heart} onClick={onClose}>
            Liked Items
          </SidebarLink>
          <SidebarLink href="/following" icon={Users} onClick={onClose}>
            Following
          </SidebarLink>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <SidebarLink href="/settings" icon={Settings} onClick={onClose}>
            Settings
          </SidebarLink>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:text-pastel-coral hover:bg-pastel-coral/10 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log out</span>
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

function SidebarLink({ 
  href, 
  icon: Icon, 
  children, 
  onClick 
}: { 
  href: string
  icon: React.ElementType
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:text-text-primary hover:bg-beige-dark rounded-xl transition-colors"
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{children}</span>
    </Link>
  )
}



