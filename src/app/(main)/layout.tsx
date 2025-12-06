import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { TopBar } from '@/components/layout/TopBar'
import { BottomNav } from '@/components/layout/BottomNav'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-beige pb-20">
      <TopBar user={user} />
      <main className="max-w-[800px] mx-auto px-4 py-4">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}



