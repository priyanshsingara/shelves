'use client'

import Link from 'next/link'
import { Search, Menu } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { useState } from 'react'
import { Sidebar } from './Sidebar'

interface TopBarProps {
  user?: {
    name: string | null
    avatarUrl: string | null
  } | null
}

export function TopBar({ user }: TopBarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 bg-beige/80 backdrop-blur-md border-b border-border">
        <div className="max-w-[800px] mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-text-secondary hover:text-text-primary hover:bg-beige-dark rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/feed" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-pastel-purple rounded-xl flex items-center justify-center">
                <span className="text-lg">📚</span>
              </div>
              <span className="font-semibold text-text-primary hidden sm:block">linkink</span>
            </Link>
          </div>

          {/* Right: Search + Avatar */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-beige-dark rounded-xl transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>
            {user && (
              <Link href="/profile">
                <Avatar 
                  src={user.avatarUrl} 
                  name={user.name} 
                  size="sm"
                />
              </Link>
            )}
          </div>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={user} />
    </>
  )
}



