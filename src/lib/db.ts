import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

function getConnectionString(): string | null {
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    // Only warn/throw at actual runtime, not during build
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL) {
      throw new Error('DATABASE_URL environment variable must be set in production')
    }
    if (process.env.NODE_ENV !== 'production') {
      console.warn('⚠️  DATABASE_URL not set. Database operations will fail.')
    }
    return null
  }
  
  return connectionString
}

const connectionString = getConnectionString()
const pool = connectionString ? new Pool({ connectionString }) : null
const adapter = pool ? new PrismaPg(pool) : undefined

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient(
  adapter ? { adapter } : undefined
)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
