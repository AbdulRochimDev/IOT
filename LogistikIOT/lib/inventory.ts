import { db } from './db'

export type InventoryItem = Awaited<ReturnType<typeof db.item.findMany>>[number]

export type InventoryResult = {
  items: InventoryItem[]
  error?: string
}

type InventoryClient = {
  item: {
    findMany: typeof db.item.findMany
  }
}

const INVENTORY_ERROR_MESSAGE =
  'Inventory data is temporarily unavailable. Please try again shortly.'

export async function listInventory(client: InventoryClient = db): Promise<InventoryResult> {
  try {
    const items = await client.item.findMany({ orderBy: { sku: 'asc' } })
    return { items }
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Failed to load inventory', error)
    }
    return { items: [], error: INVENTORY_ERROR_MESSAGE }
  }
}

export const inventoryErrorMessage = INVENTORY_ERROR_MESSAGE
