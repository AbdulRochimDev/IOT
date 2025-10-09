
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { moveOut } from '@/lib/stock'

export async function GET() {
  if (!prisma) return NextResponse.json({ data: [] }, { status: 200 })
  const list = await prisma.shipment.findMany({ include: { events: true, order: true } })
  return NextResponse.json({ data: list })
}

export async function POST(req: Request) {
  if (!prisma) return NextResponse.json({ error: 'DATABASE_NOT_CONFIGURED' }, { status: 503 })
  const { number, action, warehouseCode } = await req.json()
  const shp = await prisma.shipment.findUnique({ where: { number }, include: { events: true } })
  if (!shp) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })

  if (action === 'pick') {
    const wh = await prisma.warehouse.findUnique({ where: { code: warehouseCode } })
    if (!wh) return NextResponse.json({ error: 'WAREHOUSE_NOT_FOUND' }, { status: 404 })
    const items = await prisma.shipmentItem.findMany({ where: { shipmentId: shp.id } })
    for (const it of items) { await moveOut(wh.id, it.itemId, it.qty, `PICK:${shp.number}`) }
    await prisma.shipmentEvent.create({ data: { shipmentId: shp.id, code: 'PICKED' } })
    await prisma.shipment.update({ where: { id: shp.id }, data: { status: 'PICKED' } })
  }
  if (action === 'pack') {
    await prisma.shipmentEvent.create({ data: { shipmentId: shp.id, code: 'PACKED' } })
    await prisma.shipment.update({ where: { id: shp.id }, data: { status: 'PACKED' } })
  }
  if (action === 'ship') {
    await prisma.shipmentEvent.create({ data: { shipmentId: shp.id, code: 'DISPATCHED' } })
    await prisma.shipment.update({ where: { id: shp.id }, data: { status: 'DISPATCHED' } })
  }
  if (action === 'deliver') {
    await prisma.shipmentEvent.create({ data: { shipmentId: shp.id, code: 'DELIVERED' } })
    await prisma.shipment.update({ where: { id: shp.id }, data: { status: 'DELIVERED' } })
  }

  const updated = await prisma.shipment.findUnique({ where: { id: shp.id }, include: { events: true } })
  return NextResponse.json({ ok: true, data: updated })
}
