import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if item exists
    const item = await prisma.item.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // Create like (upsert to handle race conditions)
    await prisma.like.upsert({
      where: {
        userId_itemId: {
          userId: session.id,
          itemId: id,
        },
      },
      create: {
        userId: session.id,
        itemId: id,
      },
      update: {},
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Like error:', error)
    return NextResponse.json({ error: 'Failed to like item' }, { status: 500 })
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

    await prisma.like.deleteMany({
      where: {
        userId: session.id,
        itemId: id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unlike error:', error)
    return NextResponse.json({ error: 'Failed to unlike item' }, { status: 500 })
  }
}



