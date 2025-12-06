'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  itemId: string
  initialIsLiked: boolean
  initialCount: number
}

export function LikeButton({ itemId, initialIsLiked, initialCount }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [count, setCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async () => {
    if (isLoading) return
    setIsLoading(true)

    const newIsLiked = !isLiked
    setIsLiked(newIsLiked)
    setCount(prev => newIsLiked ? prev + 1 : prev - 1)

    try {
      await fetch(`/api/items/${itemId}/like`, {
        method: newIsLiked ? 'POST' : 'DELETE',
      })
    } catch {
      // Revert on error
      setIsLiked(!newIsLiked)
      setCount(prev => newIsLiked ? prev - 1 : prev + 1)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors',
        isLiked 
          ? 'bg-pastel-pink/20 text-pastel-pink' 
          : 'text-text-secondary hover:bg-beige-dark'
      )}
    >
      <Heart className={cn('w-5 h-5', isLiked && 'fill-current')} />
      <span className="text-sm font-medium">{count}</span>
    </button>
  )
}



