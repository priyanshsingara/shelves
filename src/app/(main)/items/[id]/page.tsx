import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Avatar, Card } from '@/components/ui'
import { formatRelativeTime } from '@/lib/utils'
import { LikeButton } from '@/components/items/LikeButton'
import { CommentSection } from '@/components/items/CommentSection'
import { DeleteItemButton } from '@/components/items/DeleteItemButton'

async function getItem(id: string, userId: string) {
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      shelf: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
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
  })

  if (!item) return null
  if (!item.shelf.isPublic && item.shelf.userId !== userId) return null

  return {
    ...item,
    isLiked: item.likes.length > 0,
    likes: undefined,
  }
}

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return null

  const { id } = await params
  const item = await getItem(id, user.id)

  if (!item) {
    notFound()
  }

  const isOwner = item.shelf.userId === user.id

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          href={`/shelves/${item.shelfId}`}
          className="p-2 -ml-2 text-text-secondary hover:text-text-primary hover:bg-beige-dark rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        {isOwner && <DeleteItemButton itemId={item.id} shelfId={item.shelfId} />}
      </div>

      {/* Item Card */}
      <Card accentColor={item.shelf.color}>
        {/* Image */}
        {item.imageUrl && (
          <div className="relative aspect-video bg-beige-dark">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        <div className="p-4 space-y-4">
          {/* Title and Status */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl font-semibold text-text-primary">
                {item.title}
              </h1>
              <span 
                className="px-3 py-1 text-sm font-medium rounded-lg flex-shrink-0"
                style={{ backgroundColor: item.status === 'OWNED' ? '#C8E6C9' : '#FFE5B4' }}
              >
                {item.status === 'OWNED' ? '✓ Owned' : '♡ Wanted'}
              </span>
            </div>
            {item.description && (
              <p className="text-text-secondary mt-2">{item.description}</p>
            )}
          </div>

          {/* Shelf Info */}
          <div className="flex items-center gap-3 py-3 border-t border-b border-border">
            <Link href={`/profile/${item.shelf.user.id}`}>
              <Avatar 
                src={item.shelf.user.avatarUrl} 
                name={item.shelf.user.name} 
                size="sm"
                color={item.shelf.color}
              />
            </Link>
            <div className="flex-1">
              <p className="text-sm text-text-primary">
                Added by{' '}
                <Link href={`/profile/${item.shelf.user.id}`} className="font-medium hover:text-pastel-purple">
                  {item.shelf.user.id === user.id ? 'you' : item.shelf.user.name}
                </Link>
                {' '}to{' '}
                <Link href={`/shelves/${item.shelf.id}`} className="font-medium hover:text-pastel-purple">
                  {item.shelf.name}
                </Link>
              </p>
              <p className="text-xs text-text-muted">
                {formatRelativeTime(new Date(item.createdAt))}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <LikeButton 
              itemId={item.id} 
              initialIsLiked={item.isLiked} 
              initialCount={item._count.likes} 
            />
            <span className="text-sm text-text-muted">
              {item._count.comments} comments
            </span>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-pastel-blue text-text-primary rounded-xl font-medium hover:bg-pastel-blue/80 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Source
            </a>
          </div>
        </div>
      </Card>

      {/* Comments */}
      <CommentSection 
        itemId={item.id} 
        comments={item.comments} 
        currentUserId={user.id}
      />
    </div>
  )
}
