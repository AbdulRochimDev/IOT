
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL)

export const prisma = hasDatabaseUrl
  ? global.prisma || new PrismaClient({
      log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error']
    })
  : undefined

if (prisma && process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export const isDatabaseConfigured = hasDatabaseUrl
