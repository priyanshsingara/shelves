import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { FeedItem } from '@/components/feed/FeedItem'
import { EmptyState } from '@/components/EmptyState'

async function getFeedItems(userId: string) {
  // Get users that the current user follows
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  })

  const followingIds = following.map(f => f.followingId)

  // Include the user's own items too
  const userIds = [userId, ...followingIds]

  // Get items from followed users
  const items = await prisma.item.findMany({
    where: {
      shelf: {
        userId: { in: userIds },
        isPublic: true,
      },
    },
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
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return items.map(item => ({
    ...item,
    isLiked: item.likes.length > 0,
    likes: undefined,
  }))
}

export default async function FeedPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const items = await getFeedItems(user.id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Feed</h1>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="📚"
          title="Your feed is empty"
          description="Follow people to see their items here, or add some items to your shelves!"
        />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <FeedItem key={item.id} item={item} currentUserId={user.id} />
          ))}
        </div>
      )}
    </div>
  )
}



