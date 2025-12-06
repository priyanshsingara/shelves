'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Input, Card } from '@/components/ui'
import { ArrowLeft, Link as LinkIcon, Loader2, Check } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { isValidUrl } from '@/lib/utils'

interface Shelf {
  id: string
  name: string
  color: string
}

interface Metadata {
  title: string
  description: string | null
  imageUrl: string | null
}

export default function AddItemPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedShelfId = searchParams.get('shelf')

  const [url, setUrl] = useState('')
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [shelves, setShelves] = useState<Shelf[]>([])
  const [selectedShelfId, setSelectedShelfId] = useState<string>(preselectedShelfId || '')
  const [status, setStatus] = useState<'WANTED' | 'OWNED'>('WANTED')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Fetch user's shelves
  useEffect(() => {
    fetch('/api/shelves')
      .then(res => res.json())
      .then(data => {
        setShelves(data.shelves || [])
        if (!selectedShelfId && data.shelves?.length > 0) {
          setSelectedShelfId(preselectedShelfId || data.shelves[0].id)
        }
      })
  }, [preselectedShelfId, selectedShelfId])

  // Fetch metadata when URL changes
  useEffect(() => {
    if (!url || !isValidUrl(url)) {
      setMetadata(null)
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsFetching(true)
      setError('')
      try {
        const res = await fetch('/api/metadata', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        setMetadata(data)
      } catch {
        setError('Could not fetch link preview')
      } finally {
        setIsFetching(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [url])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!metadata || !selectedShelfId) return

    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          title: metadata.title,
          description: metadata.description,
          imageUrl: metadata.imageUrl,
          shelfId: selectedShelfId,
          status,
        }),
      })

      if (!res.ok) throw new Error('Failed to add item')

      router.push(`/shelves/${selectedShelfId}`)
    } catch {
      setError('Failed to add item')
    } finally {
      setIsSubmitting(false)
    }
  }

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
        <h1 className="text-xl font-semibold text-text-primary">Add Item</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Input */}
        <div className="relative">
          <Input
            placeholder="Paste a link to any product..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-11"
          />
          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          {isFetching && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted animate-spin" />
          )}
        </div>

        {/* Preview */}
        {metadata && (
          <Card className="overflow-hidden">
            {metadata.imageUrl && (
              <div className="relative aspect-video bg-beige-dark">
                <Image
                  src={metadata.imageUrl}
                  alt={metadata.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-medium text-text-primary">{metadata.title}</h3>
              {metadata.description && (
                <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                  {metadata.description}
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Shelf Selection */}
        {metadata && (
          <>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Add to Shelf
              </label>
              <div className="grid grid-cols-2 gap-2">
                {shelves.map((shelf) => (
                  <button
                    key={shelf.id}
                    type="button"
                    onClick={() => setSelectedShelfId(shelf.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                      selectedShelfId === shelf.id
                        ? 'border-text-primary bg-card shadow-sm'
                        : 'border-border hover:border-text-muted'
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: shelf.color }}
                    >
                      {selectedShelfId === shelf.id && (
                        <Check className="w-4 h-4 text-text-primary" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-text-primary truncate">
                      {shelf.name}
                    </span>
                  </button>
                ))}
              </div>
              {shelves.length === 0 && (
                <p className="text-sm text-text-muted text-center py-4">
                  No shelves yet.{' '}
                  <Link href="/shelves" className="text-pastel-purple hover:underline">
                    Create one first
                  </Link>
                </p>
              )}
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Status
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('WANTED')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    status === 'WANTED'
                      ? 'bg-pastel-yellow text-text-primary'
                      : 'bg-beige-dark text-text-secondary hover:bg-beige-dark/80'
                  }`}
                >
                  ♡ Wanted
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('OWNED')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    status === 'OWNED'
                      ? 'bg-pastel-green text-text-primary'
                      : 'bg-beige-dark text-text-secondary hover:bg-beige-dark/80'
                  }`}
                >
                  ✓ Owned
                </button>
              </div>
            </div>
          </>
        )}

        {error && (
          <p className="text-sm text-pastel-coral text-center">{error}</p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={!metadata || !selectedShelfId || isSubmitting}
          isLoading={isSubmitting}
        >
          Add to Shelf
        </Button>
      </form>
    </div>
  )
}



