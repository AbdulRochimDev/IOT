
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function main() {
  const wh = await db.warehouse.upsert({
    where: { code: 'WH-A' },
    create: { code: 'WH-A', name: 'Main Warehouse' },
    update: {}
  })
  const item = await db.item.upsert({
    where: { sku: 'BOX-001' },
    create: { sku: 'BOX-001', name: 'Cardboard Box' },
    update: {}
  })
  await db.stock.upsert({
    where: { warehouseId_itemId: { warehouseId: wh.id, itemId: item.id } },
    create: { warehouseId: wh.id, itemId: item.id, qty: 100 },
    update: { qty: 100 }
  })

  const order = await db.order.upsert({
    where: { number: 'SO-2001' },
    create: { number: 'SO-2001', status: 'NEW' },
    update: {}
  })
  const ship = await db.shipment.upsert({
    where: { number: 'SHP-2001' },
    create: { number: 'SHP-2001', orderId: order.id, status: 'CREATED' },
    update: {}
  })
  await db.shipmentItem.upsert({
    where: { shipmentId_itemId: { shipmentId: ship.id, itemId: item.id } },
    create: { shipmentId: ship.id, itemId: item.id, qty: 10 },
    update: { qty: 10 }
  })

  // Demo device/key
  const dev = await db.device.create({ data: { name: 'Gateway-01', type: 'sensor.temp', warehouseId: wh.id } })
  await db.deviceKey.create({ data: { deviceId: dev.id, keyId: 'devkey_demo', secret: 'supersecret_demo' } })

  console.log('Seed done.')
}

main().finally(() => db.$disconnect())
