import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { ItemCard } from '@/components/items/ItemCard'
import { EmptyState } from '@/components/EmptyState'
import { Button, Avatar } from '@/components/ui'
import Link from 'next/link'
import { Plus, ArrowLeft, Grid, List } from 'lucide-react'
import { ViewToggle } from '@/components/items/ViewToggle'

async function getShelf(id: string, userId: string) {
  const shelf = await prisma.shelf.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      items: {
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          likes: {
            where: { userId },
            select: { id: true },
          },
        },
      },
      _count: {
        select: { items: true },
      },
    },
  })

  if (!shelf) return null
  if (!shelf.isPublic && shelf.userId !== userId) return null

  return {
    ...shelf,
    items: shelf.items.map(item => ({
      ...item,
      isLiked: item.likes.length > 0,
      likes: undefined,
    })),
  }
}

export default async function ShelfPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>
  searchParams: Promise<{ view?: string }>
}) {
  const user = await getCurrentUser()
  if (!user) return null

  const { id } = await params
  const { view = 'grid' } = await searchParams
  const shelf = await getShelf(id, user.id)

  if (!shelf) {
    notFound()
  }

  const isOwner = shelf.userId === user.id

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link 
          href="/shelves"
          className="p-2 -ml-2 text-text-secondary hover:text-text-primary hover:bg-beige-dark rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: shelf.color }}
        >
          <span className="text-2xl">📚</span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-text-primary truncate">
            {shelf.name}
          </h1>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Avatar src={shelf.user.avatarUrl} name={shelf.user.name} size="sm" />
            <span>{shelf.user.name}</span>
            <span>·</span>
            <span>{shelf._count.items} items</span>
          </div>
        </div>
      </div>

      {shelf.description && (
        <p className="text-text-secondary">{shelf.description}</p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <ViewToggle currentView={view} />
        {isOwner && (
          <Link href={`/add?shelf=${shelf.id}`}>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </Link>
        )}
      </div>

      {/* Items */}
      {shelf.items.length === 0 ? (
        <EmptyState
          icon="✨"
          title="No items yet"
          description={isOwner ? "Add your first item to this shelf!" : "This shelf is empty"}
          action={isOwner && (
            <Link href={`/add?shelf=${shelf.id}`}>
              <Button>
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </Link>
          )}
        />
      ) : (
        <div className={view === 'grid' 
          ? 'grid grid-cols-2 gap-3' 
          : 'space-y-3'
        }>
          {shelf.items.map((item) => (
            <ItemCard 
              key={item.id} 
              item={item} 
              view={view as 'grid' | 'list'}
              shelfColor={shelf.color}
            />
          ))}
        </div>
      )}
    </div>
  )
}



