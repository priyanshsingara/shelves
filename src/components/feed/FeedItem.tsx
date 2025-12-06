'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle, ExternalLink } from 'lucide-react'
import { Card, Avatar } from '@/components/ui'
import { formatRelativeTime } from '@/lib/utils'
import { useState } from 'react'

interface FeedItemProps {
  item: {
    id: string
    title: string
    url: string
    imageUrl: string | null
    description: string | null
    status: 'OWNED' | 'WANTED'
    createdAt: Date
    shelf: {
      id: string
      name: string
      color: string
      user: {
        id: string
        name: string | null
        avatarUrl: string | null
      }
    }
    _count: {
      likes: number
      comments: number
    }
    isLiked: boolean
  }
  currentUserId: string
}

export function FeedItem({ item, currentUserId }: FeedItemProps) {
  const [isLiked, setIsLiked] = useState(item.isLiked)
  const [likesCount, setLikesCount] = useState(item._count.likes)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async () => {
    if (isLiking) return
    setIsLiking(true)

    const newIsLiked = !isLiked
    setIsLiked(newIsLiked)
    setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1)

    try {
      await fetch(`/api/items/${item.id}/like`, {
        method: newIsLiked ? 'POST' : 'DELETE',
      })
    } catch {
      // Revert on error
      setIsLiked(!newIsLiked)
      setLikesCount(prev => newIsLiked ? prev - 1 : prev + 1)
    } finally {
      setIsLiking(false)
    }
  }

  const isOwn = item.shelf.user.id === currentUserId

  return (
    <Card accentColor={item.shelf.color} className="overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <Link href={`/profile/${item.shelf.user.id}`}>
          <Avatar 
            src={item.shelf.user.avatarUrl} 
            name={item.shelf.user.name} 
            size="sm"
            color={item.shelf.color}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-primary">
            <Link href={`/profile/${item.shelf.user.id}`} className="font-medium hover:text-pastel-purple">
              {isOwn ? 'You' : item.shelf.user.name}
            </Link>
            {' '}added to{' '}
            <Link href={`/shelves/${item.shelf.id}`} className="font-medium hover:text-pastel-purple">
              {item.shelf.name}
            </Link>
          </p>
          <p className="text-xs text-text-muted">
            {formatRelativeTime(new Date(item.createdAt))}
          </p>
        </div>
        <span 
          className="px-2 py-1 text-xs font-medium rounded-lg"
          style={{ backgroundColor: item.status === 'OWNED' ? '#C8E6C9' : '#FFE5B4' }}
        >
          {item.status === 'OWNED' ? 'Owned' : 'Wanted'}
        </span>
      </div>

      {/* Image */}
      {item.imageUrl && (
        <Link href={`/items/${item.id}`} className="block relative aspect-video bg-beige-dark">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
          />
        </Link>
      )}

      {/* Content */}
      <div className="p-4">
        <Link href={`/items/${item.id}`}>
          <h3 className="font-medium text-text-primary hover:text-pastel-purple line-clamp-2">
            {item.title}
          </h3>
        </Link>
        {item.description && (
          <p className="text-sm text-text-secondary mt-1 line-clamp-2">
            {item.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex items-center gap-4">
        <button
          onClick={handleLike}
          className="flex items-center gap-1.5 text-text-secondary hover:text-pastel-pink transition-colors"
        >
          <Heart 
            className={`w-5 h-5 ${isLiked ? 'fill-pastel-pink text-pastel-pink' : ''}`} 
          />
          <span className="text-sm">{likesCount}</span>
        </button>
        <Link 
          href={`/items/${item.id}`}
          className="flex items-center gap-1.5 text-text-secondary hover:text-pastel-purple transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">{item._count.comments}</span>
        </Link>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1.5 text-text-muted hover:text-text-secondary transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="text-xs">View source</span>
        </a>
      </div>
    </Card>
  )
}



