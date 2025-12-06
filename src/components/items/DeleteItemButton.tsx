'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui'

interface DeleteItemButtonProps {
  itemId: string
  shelfId: string
}

export function DeleteItemButton({ itemId, shelfId }: DeleteItemButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) return

    setIsDeleting(true)
    try {
      await fetch(`/api/items/${itemId}`, { method: 'DELETE' })
      router.push(`/shelves/${shelfId}`)
    } catch (error) {
      console.error('Failed to delete item:', error)
      setIsDeleting(false)
    }
  }

  return (
    <Button 
      variant="ghost" 
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-pastel-coral hover:bg-pastel-coral/10"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}



