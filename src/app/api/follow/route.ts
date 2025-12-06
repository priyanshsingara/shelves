import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = await request.json()

    if (!userId || userId === session.id) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create follow (upsert to handle race conditions)
    await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: session.id,
          followingId: userId,
        },
      },
      create: {
        followerId: session.id,
        followingId: userId,
      },
      update: {},
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Follow error:', error)
    return NextResponse.json({ error: 'Failed to follow user' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    await prisma.follow.deleteMany({
      where: {
        followerId: session.id,
        followingId: userId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unfollow error:', error)
    return NextResponse.json({ error: 'Failed to unfollow user' }, { status: 500 })
  }
}



