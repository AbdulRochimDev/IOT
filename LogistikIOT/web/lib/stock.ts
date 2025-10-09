
import { prisma } from './db'

export async function moveIn(warehouseId: string, itemId: string, qty: number, ref?: string) {
  const stock = await prisma.stock.upsert({
    where: { warehouseId_itemId: { warehouseId, itemId } },
    create: { warehouseId, itemId, qty },
    update: { qty: { increment: qty } }
  })
  await prisma.movement.create({ data: { warehouseId, itemId, qty, type: 'IN', ref } })
  return stock
}

export async function moveOut(warehouseId: string, itemId: string, qty: number, ref?: string) {
  const current = await prisma.stock.findUnique({ where: { warehouseId_itemId: { warehouseId, itemId } } })
  if (!current || current.qty < qty) throw new Error('INSUFFICIENT_STOCK')
  const stock = await prisma.stock.update({
    where: { warehouseId_itemId: { warehouseId, itemId } },
    data: { qty: { decrement: qty } }
  })
  await prisma.movement.create({ data: { warehouseId, itemId, qty, type: 'OUT', ref } })
  return stock
}
