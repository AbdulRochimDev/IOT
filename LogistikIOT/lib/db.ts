import { PrismaClient } from '@prisma/client'

type GlobalPrisma = {
  prisma?: PrismaClient
}

const globalForPrisma = globalThis as GlobalPrisma

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
