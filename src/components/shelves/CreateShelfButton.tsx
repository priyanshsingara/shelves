'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button, Modal, Input, ColorPicker } from '@/components/ui'
import { useRouter } from 'next/navigation'
import { PASTEL_COLORS } from '@/lib/utils'

interface CreateShelfButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function CreateShelfButton({ variant = 'ghost' }: CreateShelfButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState<string>(PASTEL_COLORS[0].value)
  const [isPublic, setIsPublic] = useState(true)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Name is required')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/shelves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, color, isPublic }),
      })

      if (!res.ok) {
        throw new Error('Failed to create shelf')
      }

      setIsOpen(false)
      setName('')
      setDescription('')
      setColor(PASTEL_COLORS[0].value)
      setIsPublic(true)
      router.refresh()
    } catch {
      setError('Failed to create shelf')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button variant={variant} onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4 mr-1" />
        New Shelf
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Shelf">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            placeholder="e.g., Sneakers I Want"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={error}
          />

          <Input
            label="Description (optional)"
            placeholder="What's this shelf about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Color
            </label>
            <ColorPicker value={color} onChange={setColor} />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">
              Public shelf
            </label>
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                isPublic ? 'bg-pastel-green' : 'bg-beige-dark'
              }`}
            >
              <span 
                className={`absolute top-1 w-4 h-4 bg-card rounded-full shadow transition-transform ${
                  isPublic ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="secondary" 
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              isLoading={isLoading}
            >
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

