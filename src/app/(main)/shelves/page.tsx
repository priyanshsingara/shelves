import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ShelfCard } from '@/components/shelves/ShelfCard'
import { CreateShelfButton } from '@/components/shelves/CreateShelfButton'
import { EmptyState } from '@/components/EmptyState'

async function getUserShelves(userId: string) {
  return prisma.shelf.findMany({
    where: { userId },
    include: {
      _count: {
        select: { items: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export default async function ShelvesPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const shelves = await getUserShelves(user.id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">My Shelves</h1>
        <CreateShelfButton />
      </div>

      {shelves.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No shelves yet"
          description="Create your first shelf to start collecting your favorite things!"
          action={<CreateShelfButton variant="primary" />}
        />
      ) : (
        <div className="grid gap-4">
          {shelves.map((shelf) => (
            <ShelfCard key={shelf.id} shelf={shelf} />
          ))}
        </div>
      )}
    </div>
  )
}



