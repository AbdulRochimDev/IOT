
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { moveIn, moveOut } from '@/lib/stock'

export async function POST(req: Request) {
  if (!prisma) return NextResponse.json({ error: 'DATABASE_NOT_CONFIGURED' }, { status: 503 })
  const { code, mode = 'count', warehouseCode = 'WH-A', qty = 1 } = await req.json()
  if (!code) return NextResponse.json({ error: 'NO_CODE' }, { status: 400 })

  const wh = await prisma.warehouse.findUnique({ where: { code: warehouseCode } })
  if (!wh) return NextResponse.json({ error: 'WAREHOUSE_NOT_FOUND' }, { status: 404 })

  const item = await prisma.item.findUnique({ where: { sku: code } })
  if (!item) return NextResponse.json({ error: 'ITEM_NOT_FOUND', detail: 'SKU tidak ditemukan' }, { status: 404 })

  if (mode === 'inbound') await moveIn(wh.id, item.id, qty, 'SCAN_IN')
  else if (mode === 'outbound') await moveOut(wh.id, item.id, qty, 'SCAN_OUT')
  else if (mode === 'count') {
    await prisma.stock.upsert({
      where: { warehouseId_itemId: { warehouseId: wh.id, itemId: item.id } },
      create: { warehouseId: wh.id, itemId: item.id, qty },
      update: { qty }
    })
    await prisma.movement.create({ data: { warehouseId: wh.id, itemId: item.id, qty, type: 'ADJ', ref: 'CYCLE_COUNT' } })
  }

  return NextResponse.json({ ok: true })
}
