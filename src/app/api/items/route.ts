import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const createItemSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1).max(500),
  description: z.string().max(1000).nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  shelfId: z.string(),
  status: z.enum(['OWNED', 'WANTED']).default('WANTED'),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = createItemSchema.parse(body)

    // Verify shelf ownership
    const shelf = await prisma.shelf.findUnique({
      where: { id: data.shelfId },
      select: { userId: true },
    })

    if (!shelf) {
      return NextResponse.json({ error: 'Shelf not found' }, { status: 404 })
    }

    if (shelf.userId !== session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const item = await prisma.item.create({
      data: {
        url: data.url,
        title: data.title,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        status: data.status,
        shelfId: data.shelfId,
      },
    })

    // Update shelf's updatedAt
    await prisma.shelf.update({
      where: { id: data.shelfId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error('Create item error:', error)
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}

