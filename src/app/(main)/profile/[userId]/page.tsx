import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Avatar, Card, Button } from '@/components/ui'
import { ShelfCard } from '@/components/shelves/ShelfCard'
import { FollowButton } from '@/components/profile/FollowButton'
import { EmptyState } from '@/components/EmptyState'
import { Settings } from 'lucide-react'
import Link from 'next/link'

async function getProfile(userId: string, currentUserId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      shelves: {
        where: {
          OR: [
            { isPublic: true },
            { userId: currentUserId },
          ],
        },
        include: {
          _count: {
            select: { items: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
      },
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
      followers: {
        where: { followerId: currentUserId },
        select: { id: true },
      },
    },
  })

  if (!user) return null

  return {
    ...user,
    isFollowing: user.followers.length > 0,
    followers: undefined,
  }
}

export default async function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const currentUser = await getCurrentUser()
  if (!currentUser) return null

  const { userId } = await params
  const profile = await getProfile(userId, currentUser.id)

  if (!profile) {
    notFound()
  }

  const isOwnProfile = profile.id === currentUser.id

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <Avatar 
            src={profile.avatarUrl} 
            name={profile.name} 
            size="lg"
            color="#D4C5E8"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-text-primary truncate">
                {profile.name || 'User'}
              </h1>
              {isOwnProfile && (
                <Link href="/settings">
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
            <p className="text-text-secondary text-sm">{profile.email}</p>
            <div className="flex items-center gap-4 mt-3">
              <Link href={`/profile/${userId}/followers`} className="text-sm hover:text-pastel-purple">
                <span className="font-semibold text-text-primary">{profile._count.followers}</span>
                <span className="text-text-muted ml-1">followers</span>
              </Link>
              <Link href={`/profile/${userId}/following`} className="text-sm hover:text-pastel-purple">
                <span className="font-semibold text-text-primary">{profile._count.following}</span>
                <span className="text-text-muted ml-1">following</span>
              </Link>
            </div>
          </div>
        </div>
        
        {!isOwnProfile && (
          <div className="mt-4">
            <FollowButton 
              userId={profile.id} 
              initialIsFollowing={profile.isFollowing}
            />
          </div>
        )}
      </Card>

      {/* Shelves */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            {isOwnProfile ? 'My Shelves' : 'Shelves'}
          </h2>
          <span className="text-sm text-text-muted">
            {profile.shelves.length} {profile.shelves.length === 1 ? 'shelf' : 'shelves'}
          </span>
        </div>

        {profile.shelves.length === 0 ? (
          <EmptyState
            icon="📚"
            title="No shelves yet"
            description={isOwnProfile 
              ? "Create your first shelf to start collecting!" 
              : "This user hasn't created any public shelves yet."
            }
          />
        ) : (
          <div className="grid gap-4">
            {profile.shelves.map((shelf) => (
              <ShelfCard key={shelf.id} shelf={shelf} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



