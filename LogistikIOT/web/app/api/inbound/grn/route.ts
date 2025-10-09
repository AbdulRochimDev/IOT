
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { moveIn } from '@/lib/stock'

export async function POST(req: Request) {
  if (!prisma) return NextResponse.json({ error: 'DATABASE_NOT_CONFIGURED' }, { status: 503 })
  const body = await req.json().catch(()=>({}))
  const { warehouseCode = 'WH-A' } = body || {}
  const wh = await prisma.warehouse.findUnique({ where: { code: warehouseCode } })
  if (!wh) return NextResponse.json({ error: 'WAREHOUSE_NOT_FOUND' }, { status: 404 })
  const item = await prisma.item.findUnique({ where: { sku: 'BOX-001' } })
  if (!item) return NextResponse.json({ error: 'ITEM_NOT_FOUND' }, { status: 404 })
  const grnNumber = `GRN-${Date.now()}`
  await moveIn(wh.id, item.id, 10, grnNumber)
  return NextResponse.json({ ok: true, grnNumber })
}
