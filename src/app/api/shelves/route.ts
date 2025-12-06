import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const createShelfSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  isPublic: z.boolean().default(true),
})

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const shelves = await prisma.shelf.findMany({
      where: { userId: session.id },
      include: {
        _count: {
          select: { items: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ shelves })
  } catch (error) {
    console.error('Get shelves error:', error)
    return NextResponse.json({ error: 'Failed to get shelves' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = createShelfSchema.parse(body)

    const shelf = await prisma.shelf.create({
      data: {
        ...data,
        userId: session.id,
      },
    })

    return NextResponse.json({ shelf }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error('Create shelf error:', error)
    return NextResponse.json({ error: 'Failed to create shelf' }, { status: 500 })
  }
}

