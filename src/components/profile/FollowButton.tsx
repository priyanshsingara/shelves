'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { UserPlus, UserMinus } from 'lucide-react'

interface FollowButtonProps {
  userId: string
  initialIsFollowing: boolean
}

export function FollowButton({ userId, initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (isLoading) return
    setIsLoading(true)

    const newIsFollowing = !isFollowing
    setIsFollowing(newIsFollowing)

    try {
      await fetch('/api/follow', {
        method: newIsFollowing ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
    } catch {
      // Revert on error
      setIsFollowing(!newIsFollowing)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleClick}
      variant={isFollowing ? 'secondary' : 'primary'}
      disabled={isLoading}
      className="w-full"
    >
      {isFollowing ? (
        <>
          <UserMinus className="w-4 h-4 mr-2" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4 mr-2" />
          Follow
        </>
      )}
    </Button>
  )
}



