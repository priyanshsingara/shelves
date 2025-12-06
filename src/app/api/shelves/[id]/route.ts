import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const updateShelfSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  isPublic: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const shelf = await prisma.shelf.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        items: {
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
            likes: {
              where: { userId: session.id },
              select: { id: true },
            },
          },
        },
        _count: {
          select: { items: true },
        },
      },
    })

    if (!shelf) {
      return NextResponse.json({ error: 'Shelf not found' }, { status: 404 })
    }

    // Check if user can view this shelf
    if (!shelf.isPublic && shelf.userId !== session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Transform items to include isLiked
    const items = shelf.items.map(item => ({
      ...item,
      isLiked: item.likes.length > 0,
      likes: undefined,
    }))

    return NextResponse.json({ 
      shelf: {
        ...shelf,
        items,
      }
    })
  } catch (error) {
    console.error('Get shelf error:', error)
    return NextResponse.json({ error: 'Failed to get shelf' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check ownership
    const existingShelf = await prisma.shelf.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!existingShelf) {
      return NextResponse.json({ error: 'Shelf not found' }, { status: 404 })
    }

    if (existingShelf.userId !== session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const data = updateShelfSchema.parse(body)

    const shelf = await prisma.shelf.update({
      where: { id },
      data,
    })

    return NextResponse.json({ shelf })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error('Update shelf error:', error)
    return NextResponse.json({ error: 'Failed to update shelf' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check ownership
    const existingShelf = await prisma.shelf.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!existingShelf) {
      return NextResponse.json({ error: 'Shelf not found' }, { status: 404 })
    }

    if (existingShelf.userId !== session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.shelf.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete shelf error:', error)
    return NextResponse.json({ error: 'Failed to delete shelf' }, { status: 500 })
  }
}

