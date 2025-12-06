'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle } from 'lucide-react'
import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'

interface ItemCardProps {
  item: {
    id: string
    title: string
    imageUrl: string | null
    status: 'OWNED' | 'WANTED'
    _count: {
      likes: number
      comments: number
    }
    isLiked: boolean
  }
  view: 'grid' | 'list'
  shelfColor: string
}

export function ItemCard({ item, view, shelfColor }: ItemCardProps) {
  if (view === 'grid') {
    return (
      <Link href={`/items/${item.id}`}>
        <Card className="overflow-hidden group">
          <div className="relative aspect-square bg-beige-dark">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl">📦</span>
              </div>
            )}
            <div 
              className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium rounded-lg"
              style={{ backgroundColor: item.status === 'OWNED' ? '#C8E6C9' : '#FFE5B4' }}
            >
              {item.status === 'OWNED' ? '✓' : '♡'}
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-medium text-text-primary text-sm line-clamp-2 group-hover:text-pastel-purple transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center gap-3 mt-2 text-text-muted">
              <span className="flex items-center gap-1 text-xs">
                <Heart className={cn('w-3 h-3', item.isLiked && 'fill-pastel-pink text-pastel-pink')} />
                {item._count.likes}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <MessageCircle className="w-3 h-3" />
                {item._count.comments}
              </span>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/items/${item.id}`}>
      <Card accentColor={shelfColor} className="overflow-hidden">
        <div className="flex gap-4 p-4">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-beige-dark flex-shrink-0">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-text-primary line-clamp-2 hover:text-pastel-purple transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <span 
                className="px-2 py-0.5 text-xs font-medium rounded-lg"
                style={{ backgroundColor: item.status === 'OWNED' ? '#C8E6C9' : '#FFE5B4' }}
              >
                {item.status === 'OWNED' ? 'Owned' : 'Wanted'}
              </span>
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <Heart className={cn('w-3 h-3', item.isLiked && 'fill-pastel-pink text-pastel-pink')} />
                {item._count.likes}
              </span>
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <MessageCircle className="w-3 h-3" />
                {item._count.comments}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}



