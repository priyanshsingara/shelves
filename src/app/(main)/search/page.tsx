'use client'

import { useState, useEffect } from 'react'
import { Search as SearchIcon, ArrowLeft } from 'lucide-react'
import { Input, Card, Avatar } from '@/components/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string | null
  avatarUrl: string | null
  _count: {
    shelves: number
    followers: number
  }
}

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.users || [])
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => router.back()}
          className="p-2 -ml-2 text-text-secondary hover:text-text-primary hover:bg-beige-dark rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-text-primary">Search</h1>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Input
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-11"
          autoFocus
        />
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-8 text-text-muted">Searching...</div>
      ) : results.length > 0 ? (
        <div className="space-y-2">
          {results.map((user) => (
            <Link key={user.id} href={`/profile/${user.id}`}>
              <Card className="p-4 hover:bg-beige-dark/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar src={user.avatarUrl} name={user.name} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">
                      {user.name || 'User'}
                    </p>
                    <p className="text-sm text-text-muted">
                      {user._count.shelves} shelves · {user._count.followers} followers
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : query.trim() ? (
        <div className="text-center py-8 text-text-muted">
          No users found for &ldquo;{query}&rdquo;
        </div>
      ) : (
        <div className="text-center py-8 text-text-muted">
          Search for users to follow
        </div>
      )}
    </div>
  )
}



