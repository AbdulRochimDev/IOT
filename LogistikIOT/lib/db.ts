import { PrismaClient } from '@prisma/client'

type ItemDelegate = PrismaClient['item']
type EventDelegate = PrismaClient['event']
type FindManyArgs = Parameters<ItemDelegate['findMany']>
type FindManyReturn = ReturnType<ItemDelegate['findMany']>
type EventCreateArgs = Parameters<EventDelegate['create']>
type EventCreateReturn = ReturnType<EventDelegate['create']>

const globalForPrisma = globalThis as { prisma?: PrismaClient }
const hasDatabaseConfig = Boolean(process.env.DATABASE_URL)

const prismaClient = hasDatabaseConfig
  ? globalForPrisma.prisma ?? new PrismaClient({ log: ['warn', 'error'] })
  : undefined

if (prismaClient && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaClient
}

if (!prismaClient && process.env.NODE_ENV !== 'test') {
  console.warn(
    'DATABASE_URL is not set. Falling back to sample data; mutations will be disabled.',
  )
}

const SAMPLE_INVENTORY: Awaited<FindManyReturn> = [
  {
    id: 1n,
    sku: 'DEMO-001',
    name: 'Sample Inventory Item',
    qty: 120,
  },
  {
    id: 2n,
    sku: 'DEMO-002',
    name: 'Sample Inventory Item 2',
    qty: 45,
  },
]

const fallbackDb = {
  item: {
    async findMany(...args: FindManyArgs) {
      const [options] = args
      const orderBy = Array.isArray(options?.orderBy)
        ? options?.orderBy[0]
        : options?.orderBy

      if (orderBy && typeof orderBy === 'object' && 'sku' in orderBy) {
        const direction = orderBy.sku === 'desc' ? -1 : 1
        return [...SAMPLE_INVENTORY].sort((a, b) =>
          a.sku.localeCompare(b.sku) * direction,
        )
      }

      return SAMPLE_INVENTORY
    },
  },
  event: {
    async create(..._args: EventCreateArgs): Promise<Awaited<EventCreateReturn>> {
      throw new Error('Database connection is not configured. Unable to record events.')
    },
  },
}

export const isDatabaseConfigured = Boolean(prismaClient)
export const db = (prismaClient ?? fallbackDb) as Pick<
  PrismaClient,
  'item' | 'event'
>
