import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './db'

function getJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  
  if (!secret || secret === 'fallback-secret-change-in-production') {
    // Only throw at actual runtime (when functions are called), not during build
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL) {
      throw new Error('JWT_SECRET environment variable must be set in production')
    }
    if (process.env.NODE_ENV !== 'production') {
      console.warn('⚠️  JWT_SECRET not set. Using fallback (development only).')
    }
    return new TextEncoder().encode('fallback-secret-change-in-production-dev-only')
  }
  
  return new TextEncoder().encode(secret)
}

export interface UserPayload {
  id: string
  email: string
  name: string | null
}

export async function createToken(user: UserPayload): Promise<string> {
  const secret = getJWTSecret()
  return new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const secret = getJWTSecret()
    const { payload } = await jwtVerify(token, secret)
    return payload.user as UserPayload
  } catch {
    return null
  }
}

export async function getSession(): Promise<UserPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) return null
  
  return verifyToken(token)
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null
  
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      createdAt: true,
    }
  })
  
  return user
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}



