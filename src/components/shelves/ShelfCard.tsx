'use client'

import Link from 'next/link'
import { BookOpen, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ShelfCardProps {
  shelf: {
    id: string
    name: string
    description: string | null
    color: string
    isPublic: boolean
    _count: {
      items: number
    }
  }
}

export function ShelfCard({ shelf }: ShelfCardProps) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this shelf? All items will be removed.')) {
      return
    }

    setIsDeleting(true)
    try {
      await fetch(`/api/shelves/${shelf.id}`, { method: 'DELETE' })
      router.refresh()
    } catch (error) {
      console.error('Failed to delete shelf:', error)
    } finally {
      setIsDeleting(false)
      setShowMenu(false)
    }
  }

  return (
    <Card accentColor={shelf.color}>
      <Link href={`/shelves/${shelf.id}`} className="block p-4">
        <div className="flex items-start gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: shelf.color }}
          >
            <BookOpen className="w-6 h-6 text-text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-text-primary">{shelf.name}</h3>
            {shelf.description && (
              <p className="text-sm text-text-secondary line-clamp-1 mt-0.5">
                {shelf.description}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-text-muted">
                {shelf._count.items} {shelf._count.items === 1 ? 'item' : 'items'}
              </span>
              {!shelf.isPublic && (
                <span className="text-xs text-text-muted px-2 py-0.5 bg-beige-dark rounded-full">
                  Private
                </span>
              )}
            </div>
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
              className="p-2 text-text-muted hover:text-text-primary hover:bg-beige-dark rounded-xl transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowMenu(false)
                  }}
                />
                <div className="absolute right-0 top-full mt-1 z-20 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[140px]">
                  <Link
                    href={`/shelves/${shelf.id}/edit`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-beige-dark transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleDelete()
                    }}
                    disabled={isDeleting}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-pastel-coral hover:bg-pastel-coral/10 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Link>
    </Card>
  )
}



