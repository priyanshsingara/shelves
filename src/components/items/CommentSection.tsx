'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send } from 'lucide-react'
import { Avatar, Card, Input, Button } from '@/components/ui'
import { formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'

interface Comment {
  id: string
  content: string
  createdAt: Date
  user: {
    id: string
    name: string | null
    avatarUrl: string | null
  }
}

interface CommentSectionProps {
  itemId: string
  comments: Comment[]
  currentUserId: string
}

export function CommentSection({ itemId, comments: initialComments, currentUserId }: CommentSectionProps) {
  const router = useRouter()
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/items/${itemId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      })

      if (!res.ok) throw new Error('Failed to post comment')

      const { comment } = await res.json()
      setComments([comment, ...comments])
      setNewComment('')
      router.refresh()
    } catch (error) {
      console.error('Failed to post comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">Comments</h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={!newComment.trim() || isSubmitting}
          isLoading={isSubmitting}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="text-center text-text-muted py-8">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex gap-3">
                <Link href={`/profile/${comment.user.id}`}>
                  <Avatar 
                    src={comment.user.avatarUrl} 
                    name={comment.user.name} 
                    size="sm"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/profile/${comment.user.id}`}
                      className="font-medium text-text-primary hover:text-pastel-purple"
                    >
                      {comment.user.id === currentUserId ? 'You' : comment.user.name}
                    </Link>
                    <span className="text-xs text-text-muted">
                      {formatRelativeTime(new Date(comment.createdAt))}
                    </span>
                  </div>
                  <p className="text-text-secondary mt-1">{comment.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}



